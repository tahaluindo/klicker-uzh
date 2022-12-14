import React from 'react'
import { Dropdown } from 'semantic-ui-react'
import { defineMessages, useIntl } from 'react-intl'
import { push } from '@socialgouv/matomo-next'

import { CHART_TYPES } from '../../constants'

const messages = defineMessages({
  title: {
    defaultMessage: 'Visualization',
    id: 'evaluation.visualization.title',
  },
})

interface Props {
  activeVisualization: string
  onChangeType: (questionType: string, value: string) => void
  questionType: string
}

const options = [
  { text: 'Pie Chart', value: CHART_TYPES.PIE_CHART, withinType: ['SC'] },
  {
    text: 'Bar Chart',
    value: CHART_TYPES.BAR_CHART,
    withinType: ['SC', 'MC', 'FREE_RANGE'],
  },
  { text: 'Stacked Chart', value: CHART_TYPES.STACK_CHART, withinType: ['MC'] },
  {
    text: 'Word Cloud',
    value: CHART_TYPES.CLOUD_CHART,
    withinType: ['FREE', 'FREE_RANGE'],
  },
  {
    text: 'Table',
    value: CHART_TYPES.TABLE,
    withinType: ['SC', 'MC', 'FREE', 'FREE_RANGE'],
  },
  { text: 'Histogram', value: CHART_TYPES.HISTOGRAM, withinType: ['FREE_RANGE'] },
]

function VisualizationType({ activeVisualization, onChangeType, questionType }: Props): React.ReactElement {
  const intl = useIntl()
  return (
    <div className="visualizationType print:hidden">
      <Dropdown
        selection
        upward
        options={options.filter((o): boolean => o.withinType.includes(questionType))}
        placeholder={intl.formatMessage(messages.title)}
        value={activeVisualization}
        onChange={(_, { value }: { value: string }): void => {
          onChangeType(questionType, value)
          push(['trackEvent', 'Session Evaluation', `Visualization Activated (${questionType})`, value])
        }}
      />
    </div>
  )
}

export default VisualizationType
