import { InstanceResult } from '@klicker-uzh/graphql/dist/ops'
import React from 'react'
import BarChart from './BarChart'
import Histogram from './Histogram'
import TableChart from './TableChart'
import Wordcloud from './Wordcloud'

interface ChartProps {
  chartType: string
  data: InstanceResult
  showSolution: boolean
  statisticsShowSolution?: {
    mean?: boolean
    median?: boolean
    q1?: boolean
    q3?: boolean
    sd?: boolean
  }
}

function Chart({
  chartType,
  data,
  showSolution,
  statisticsShowSolution,
}: ChartProps): React.ReactElement {
  if (chartType === 'table') {
    // TODO: add resizing possibility with sizeMe: <SizeMe refreshRate={250}>{({ size }) => <Component />}</SizeMe>
    return <TableChart data={data} showSolution={showSolution} />
  } else if (chartType === 'histogram') {
    return (
      <Histogram
        data={data}
        showSolution={{ general: showSolution, ...statisticsShowSolution }}
      />
    )
  } else if (chartType === 'wordCloud') {
    return <Wordcloud data={data} showSolution={showSolution} />
  } else if (chartType === 'barChart') {
    return <BarChart data={data} showSolution={showSolution} />
  } else {
    return <div>There exists no chart for this question type yet</div>
  }
}

export default Chart