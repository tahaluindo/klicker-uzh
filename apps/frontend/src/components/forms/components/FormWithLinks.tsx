import React from 'react'
import Link from 'next/link'
import { Button, Form, List } from 'semantic-ui-react'

interface Props {
  button: {
    disabled?: boolean
    loading?: boolean
    invalid?: boolean
    label: string
    onSubmit: any
  }
  children: React.ReactNode | any
  links: {
    href: string
    label: string
  }[]
}

function FormWithLinks({ button, children, links }: Props): React.ReactElement {
  const linkItems = links.map(
    (link): React.ReactElement => (
      <List.Item key={link.href}>
        <Link href={link.href}>
          <a>{link.label}</a>
        </Link>
      </List.Item>
    )
  )

  return (
    <div className="flex flex-col md:p-4 md:border-solid md:rounded-md md:border formWithLinks border-primary">
      <Form error className="!bg-transparent">
        {typeof children === 'function' ? children() : children}

        <div className="flex flex-col md:flex-row md:justify-between">
          <Button
            primary
            className="!flex-[0_0_100%] !mr-0 md:!order-1 md:!flex-[0_0_auto]"
            disabled={button.invalid || button.disabled}
            loading={button.loading}
            type="submit"
            onClick={button.onSubmit}
          >
            {button.label}
          </Button>

          <div className="mt-4 md:order-0 md:mt-0">
            <List>{linkItems}</List>
          </div>
        </div>
      </Form>
    </div>
  )
}

export default FormWithLinks
