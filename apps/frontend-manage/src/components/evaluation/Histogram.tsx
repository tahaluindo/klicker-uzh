import { InstanceResult } from '@klicker-uzh/graphql/dist/ops'
import { maxBy, minBy, round, sumBy } from 'lodash'
import React, { useMemo, useState } from 'react'
// TODO: replace lodash with ramda
import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

interface HistogramProps {
  data: InstanceResult
  showSolution: {
    general: boolean
    mean?: boolean
    median?: boolean
    q1?: boolean
    q3?: boolean
    sd?: boolean
  }
}

const defaultProps = {
  showSolution: {
    general: false,
    mean: false,
    median: false,
    q1: false,
    q3: false,
    sd: false,
  },
}

function Histogram({ data, showSolution }: HistogramProps): React.ReactElement {
  const [numBins, setNumBins] = useState(20)

  const processedData = useMemo(() => {
    const mappedData = Object.values(data.results).map((result) => ({
      value: +result.value,
      count: result.count,
    }))

    const min =
      data.questionData.options.restrictions &&
      typeof data.questionData.options.restrictions['min'] === 'number'
        ? data.questionData.options.restrictions['min']
        : (minBy(mappedData, 'value')?.value || 0) - 10
    const max =
      data.questionData.options.restrictions &&
      typeof data.questionData.options.restrictions['max'] === 'number'
        ? data.questionData.options.restrictions['max']
        : (maxBy(mappedData, 'value')?.value || 0) + 10

    let dataArray = Array.from({ length: numBins }, (_, i) => ({
      value: min + (max - min) * (i / numBins) + (max - min) / (2 * numBins),
    }))

    dataArray = dataArray.map((bin) => {
      const binWidth =
        dataArray.length > 1 ? dataArray[1].value - dataArray[0].value : 1
      const count = sumBy(
        mappedData.filter((result) => {
          return (
            result.value >= bin.value - binWidth / 2 &&
            result.value < bin.value + binWidth / 2
          )
        }),
        'count'
      )
      return {
        value: round(bin.value, 2),
        count,
        label: `${round(bin.value - binWidth / 2, 1)} - ${round(
          bin.value + binWidth / 2,
          1
        )}`,
      }
    })

    return { data: dataArray, domain: { min: min, max: max } }
  }, [data, numBins])

  return (
    <div>
      <ResponsiveContainer width="99%" height={500}>
        <BarChart
          data={processedData.data}
          margin={{
            bottom: 16,
            left: -24,
            right: 24,
            top: 24,
          }}
        >
          <XAxis
            dataKey="value"
            type="number"
            domain={[processedData.domain.min, processedData.domain.max]}
          />
          <YAxis
            domain={[
              0,
              (dataMax: number): number => {
                const rounded = Math.ceil(dataMax * 1.1)
                if (rounded % 2 === 0) {
                  return rounded
                }
                return rounded + 1
              },
            ]}
          />
          <CartesianGrid strokeDasharray="5 5" />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="p-2 bg-white border border-solid rounded-md border-uzh-grey-100">
                    <div>Bereich: {payload[0].payload.label}</div>
                    <div className="font-bold text-uzh-blue-80">
                      Count: {payload[0].payload.count}
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          <Bar dataKey="count" fill="rgb(19, 149, 186)" />
          {data.statistics && showSolution.mean && (
            <ReferenceLine
              isFront
              label={{
                fill: 'blue',
                fontSize: '1rem',
                position: 'top',
                value: 'MEAN',
              }}
              key={`mean-` + data.statistics.mean}
              stroke="blue"
              x={Math.round(data.statistics.mean || 0)}
            />
          )}
          {data.statistics && showSolution.median && (
            <ReferenceLine
              isFront
              label={{
                fill: 'red',
                fontSize: '1rem',
                position: 'top',
                value: 'MEDIAN',
              }}
              key={`median-` + data.statistics.median}
              stroke="red"
              x={Math.round(data.statistics.median || 0)}
            />
          )}
          {data.statistics && showSolution.q1 && (
            <ReferenceLine
              isFront
              label={{
                fill: 'black',
                fontSize: '1rem',
                position: 'top',
                value: 'Q1',
              }}
              key={`q1-` + data.statistics.q1}
              stroke="black"
              x={Math.round(data.statistics.q1 || 0)}
            />
          )}
          {data.statistics && showSolution.q3 && (
            <ReferenceLine
              isFront
              label={{
                fill: 'black',
                fontSize: '1rem',
                position: 'top',
                value: 'Q3',
              }}
              key={`q3-` + data.statistics.q3}
              stroke="black"
              x={Math.round(data.statistics.q3 || 0)}
            />
          )}
          {data.statistics && showSolution.sd && (
            <ReferenceArea
              key="sd-area"
              x1={Math.max(
                (data.statistics.mean || 0) - (data.statistics.sd ?? 0),
                processedData.domain.min
              )}
              x2={Math.min(
                (data.statistics.mean || 0) + (data.statistics.sd ?? 0),
                processedData.domain.max
              )}
              fill="gray"
              enableBackground="#FFFFFF"
              label={{
                fill: 'red',
                fontSize: '1rem',
                position: 'insideTopRight',
                value: '+- 1 SD',
              }}
            />
          )}

          {showSolution.general &&
            data.questionData.options.solutionRanges &&
            data.questionData.options.solutionRanges.map(
              (
                solutionRange: { min?: number; max?: number },
                index: number
              ) => (
                <ReferenceArea
                  key={index}
                  x1={solutionRange.min}
                  x2={solutionRange.max}
                  stroke="green"
                  fill="green"
                  enableBackground="#FFFFFF"
                  label={{
                    fill: 'green',
                    fontSize: '1rem',
                    position: 'top',
                    value: 'Korrekt',
                  }}
                />
              )
            )}
        </BarChart>
      </ResponsiveContainer>

      <div className="flex flex-row items-center float-right gap-2 mr-4">
        <div className="font-bold">Bins:</div>
        <input
          className="rounded-md"
          type="number"
          value={numBins}
          onChange={(e) => setNumBins(+e.target.value)}
        />
      </div>
    </div>
  )
}

Histogram.defaultProps = defaultProps
export default Histogram