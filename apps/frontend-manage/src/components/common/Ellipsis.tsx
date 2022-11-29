import Markdown from '@klicker-uzh/markdown'
import { Tooltip } from '@uzh-bf/design-system'
import React from 'react'
import { twMerge } from 'tailwind-merge'

interface Props {
  children: string
  maxLength: number
  withoutPopup?: boolean
  className?: {
    root?: string
    tooltip?: string
    markdown?: string
  }
}

function Ellipsis({
  children,
  maxLength,
  withoutPopup,
  className,
}: Props): React.ReactElement {
  const parsedContent = (
    <Markdown
      content={
        children
          ? children.toString().replace(/^(- |[0-9]+\. |\* |\+ )/g, '')
          : 'no content'
      }
      className={className?.markdown}
    />
  )

  const formulaRegex = RegExp(/(\${2})[^]*?[^\\]\1/gm)
  let endIndex = null

  // match first formula in an answer option
  let temp = formulaRegex.exec(children)

  // match all formulas in the answer options and break if they begin after maxLength (are cut anyways)
  // if the formulas begin before maxLength, but ends after it, include the formula in the output
  // (by setting endIndex correspondingly)
  while (temp !== null) {
    if (formulaRegex.lastIndex > maxLength) {
      if (temp.index > maxLength) {
        break
      } else {
        endIndex = formulaRegex.lastIndex
        break
      }
    }
    temp = formulaRegex.exec(children)
  }

  // compute shortened output based on either maxLength or endIndex
  const shortenedParsedContent = (
    <Markdown
      content={
        children
          ? `${children
              .toString()
              .substr(0, endIndex || maxLength)
              .replace(/^(- |[0-9]+\. |\* |\+ )/g, '')} **...**`
          : 'no content'
      }
      className={className?.markdown}
    />
  )

  // return full content if it was shorter than the set maxLength or if endIndex = children.length
  // (whole string is included in shortened version)
  if (
    children?.length <= maxLength ||
    typeof children !== 'string' ||
    children?.length === endIndex
  ) {
    return parsedContent
  }

  // return shortened content including tooltip with full content (if not explicitely disabled)
  return (
    <span className={className?.root}>
      {withoutPopup ? (
        shortenedParsedContent
      ) : (
        <Tooltip
          tooltip={parsedContent}
          tooltipStyle={twMerge(
            '!opacity-100 text-sm max-w-[50%] md:max-w-[60%]',
            className?.tooltip
          )}
          withArrow={false}
        >
          {shortenedParsedContent}
        </Tooltip>
      )}
    </span>
  )
}

Ellipsis.defaultProps = {
  withoutPopup: false,
}

export default Ellipsis