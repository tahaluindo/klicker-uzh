import React from 'react'
import _sortBy from 'lodash/sortBy'
import {
  ResponsiveContainer,
  Bar,
  BarChart as BarChartComponent,
  CartesianGrid,
  Cell,
  LabelList,
  XAxis,
  YAxis,
} from 'recharts'

import { CHART_COLORS, CHART_TYPES } from '../../../constants'
import { indexToLetter, getLabelIn, getLabelOut } from '../../../lib/utils/charts'

interface Props {
  data?: {
    correct?: boolean
    count: number
    value: string
  }[]
  isColored?: boolean
  isSolutionShown?: boolean
  totalResponses?: number
  questionType: string
}

const defaultProps = {
  data: [],
  isColored: true,
  isSolutionShown: false,
  totalResponses: 0,
}

function BarChart({ isSolutionShown, data, isColored, totalResponses, questionType }: Props): React.ReactElement {
  // filter out choices without any responses (weird labeling)
  // map data to contain percentages and char labels
  const sortedData = _sortBy(
    data.map(({ correct, count, value }, index): any => ({
      correct,
      count,
      fill: CHART_COLORS[index % 12],
      label: questionType === 'FREE_RANGE' ? +value : indexToLetter(index),
      labelIn: getLabelIn(CHART_TYPES.BAR_CHART, count, totalResponses, index),
      labelOut: getLabelOut(CHART_TYPES.BAR_CHART, count, totalResponses, index),
      value,
    })),
    (o): string => o.label
  )

  return (
    <ResponsiveContainer>
      <BarChartComponent
        data={sortedData}
        margin={{
          bottom: 24,
          left: 24,
          right: 24,
          top: 24,
        }}
      >
        <XAxis
          dataKey="label"
          tick={{
            fill: 'black',
            offset: 30,
            stroke: 'black',
            style: { fontSize: '2.5rem' },
          }}
        />
        <YAxis
          domain={[
            0,
            (dataMax): number => {
              const rounded = Math.ceil(dataMax * 1.1)

              if (rounded % 2 === 0) {
                return rounded
              }

              return rounded + 1
            },
          ]}
          label={{ angle: -90, position: 'insideLeft', value: 'Responses' }}
        />
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <Bar
          dataKey="count"
          isAnimationActive={false}
          // HACK: don't animate as it causes labels to disappear
          maxBarSize={100}
        >
          <LabelList
            dataKey="labelOut"
            fill="black"
            offset={15}
            position="top"
            stroke="black"
            strokeWidth={1}
            style={{ fontSize: '2rem' }}
          />
          <LabelList dataKey="labelIn" fill="white" position="inside" stroke="white" style={{ fontSize: '2.5rem' }} />
          {sortedData.map(
            (row): React.ReactElement => (
              <Cell
                fill={
                  isSolutionShown && row.correct // eslint-disable-line
                    ? '#00FF00'
                    : isColored
                    ? row.fill
                    : '#1395BA'
                }
                key={row.value}
              />
            )
          )}
        </Bar>
      </BarChartComponent>
    </ResponsiveContainer>
  )
}

BarChart.defaultProps = defaultProps

export default BarChart
