import { CheckIcon } from '@heroicons/react/outline'
import * as RadixCheckbox from '@radix-ui/react-checkbox'
import React from 'react'
import { twMerge } from 'tailwind-merge'

interface Props {
  children?: React.ReactNode
  checked: boolean | 'indeterminate'
  onCheck: any
  id: string
  className?: string
}

const defaultProps = {
  className: '',
  children: undefined,
}

function CustomCheckbox({ children, checked, onCheck, id, className }: Props): React.ReactElement {
  return (
    <RadixCheckbox.Root
      defaultChecked
      checked={checked}
      className={twMerge(
        'flex justify-center w-5 h-5 p-0 bg-white border border-solid rounded-md border-grey-80 align-center',
        checked && 'border-black',
        className
      )}
      id={`check-${id}`}
      onCheckedChange={() => onCheck()}
    >
      <RadixCheckbox.CheckboxIndicator>{children || <CheckIcon />}</RadixCheckbox.CheckboxIndicator>
    </RadixCheckbox.Root>
  )
}

CustomCheckbox.defaultProps = defaultProps

export default CustomCheckbox