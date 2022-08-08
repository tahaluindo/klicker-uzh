import { useMutation } from '@apollo/client'
import { faUser } from '@fortawesome/free-regular-svg-icons'
import { faGear } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Navigation } from '@uzh-bf/design-system'
import getConfig from 'next/config'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useContext } from 'react'

import LogoutMutation from '../../../graphql/mutations/LogoutMutation.graphql'
import { UserContext } from '../../../lib/userContext'

const { publicRuntimeConfig } = getConfig()

interface Props {
  actions?: any[]
  search?: {
    handleSearch: any
    handleSortByChange: any
    handleSortOrderToggle: any
    sortingTypes: {
      content: string
      id: string
      labelStart: string
    }[]
    withSorting: boolean
  }
  handleSidebarToggle: () => void
  sidebarVisible?: boolean
  title: string
}

const defaultProps = {
  actions: [],
  search: undefined,
  sidebarVisible: false,
}

function Navbar({ actions, search, sidebarVisible, title, handleSidebarToggle }: Props): React.ReactElement {
  const router = useRouter()

  const [logout] = useMutation(LogoutMutation)

  const user = useContext(UserContext)

  return (
    <Navigation>
      <Navigation.NavigationMenu position="left">
        <Link passHref href="/questions">
          <Navigation.LinkItem link="/questions" linkName="Questions" />
        </Link>
        <Link passHref href="/sessions">
          <Navigation.LinkItem link="/sessions" linkName="Sessions" />
        </Link>
      </Navigation.NavigationMenu>
      <Navigation.NavigationMenu position="right">
        <Navigation.ButtonItem>
          <Link passHref href="/sessions/running">
            <Button>Running Session</Button>
          </Link>
        </Navigation.ButtonItem>
        <Navigation.TriggerItem triggerIcon={<FontAwesomeIcon icon={faUser} />} triggerName="User">
          <Link passHref href="/user/settings">
            <Navigation.DropdownItem
              icon={<FontAwesomeIcon icon={faGear} />}
              link="https://wikipedia.org"
              title="Settings"
            />
          </Link>
          {/* <Navigation.DropdownItem icon={<FontAwesomeIcon icon={faRightFromBracket} />} title="Sign out" /> */}
        </Navigation.TriggerItem>
      </Navigation.NavigationMenu>
    </Navigation>
  )

  // return (
  //   <div className="text-gray-50 navbar bg-primary-strong">
  //     <div className="sideArea">
  //       <Menu borderless className="noBorder">
  //         <Menu.Item icon active={sidebarVisible} className="sidebar" name="sidebar" onClick={handleSidebarToggle}>
  //           <Icon name="sidebar" />
  //         </Menu.Item>
  //         <h1>{title}</h1>
  //       </Menu>
  //     </div>

  //     {actions && <div className="actionArea">{actions}</div>}

  //     {search && (
  //       <div className="searchArea">
  //         <SearchArea handleSearch={search.handleSearch} />
  //       </div>
  //     )}

  //     <div className="accountArea">
  //       {(() => {
  //         const accountId = user?.id
  //         const accountShort = user?.shortname
  //         const role = user?.role
  //         const runningSessionId = user?.runningSession?.id

  //         if (typeof window !== 'undefined') {
  //           if (publicRuntimeConfig.sentryDSN) {
  //             try {
  //               const Sentry = require('@sentry/nextjs')
  //               Sentry.setUser({ id: accountId, username: accountShort })
  //             } catch (e) {
  //               //
  //             }
  //           }
  //         }

  //         return (
  //           <Menu borderless className="loginArea noBorder">
  //             <Menu.Menu position="right">
  //               {accountShort && <SessionArea sessionId={runningSessionId} />}

  //               <AccountArea
  //                 accountShort={accountShort}
  //                 role={role}
  //                 onLogout={async (): Promise<void> => {
  //                   // logout
  //                   await logout()

  //                   push(['trackEvent', 'User', 'Logged Out'])

  //                   // redirect to the landing page
  //                   router.push('/')
  //                 }}
  //               />
  //             </Menu.Menu>
  //           </Menu>
  //         )
  //       })()}
  //     </div>

  //     <style jsx>{`
  //       @import 'src/theme';

  //       .navbar {
  //         display: flex;
  //         align-items: center;
  //         flex-flow: row wrap;
  //         justify-content: space-between;

  //         padding: 0;

  //         z-index: 100;

  //         .sideArea {
  //           flex: 1;
  //           order: 0;

  //           h1 {
  //             margin: 0;
  //             padding: 0 1rem 0 0.5rem;
  //             display: flex;
  //             align-items: center;
  //             font-weight: bold;
  //           }

  //           :global(.sidebar),
  //           :global(.menu) {
  //             color: white;
  //             border-radius: 0;
  //             font-size: $font-size-h1;
  //             background-color: $color-primary-strong;
  //           }

  //           :global(.sidebar.active) {
  //             background-color: $color-primary-20p;
  //           }
  //         }

  //         .searchArea {
  //           flex: 0 0 100%;
  //           order: 1;

  //           padding: 1rem;
  //           padding-top: 0.5rem;

  //           @include desktop-only {
  //             padding: 0.2rem 3rem;
  //           }
  //         }

  //         .accountArea {
  //           display: none;

  //           :global(.menu),
  //           :global(.ui.dropdown .menu > .item) {
  //             background-color: $color-primary-strong;
  //             color: $color-white;

  //             :global(.item) {
  //               color: $color-white;
  //               padding-top: 0;
  //               padding-bottom: 0;
  //             }
  //           }
  //         }

  //         @include desktop-tablet-only {
  //           flex-wrap: nowrap;

  //           .sideArea {
  //             flex: 0 0 auto;
  //           }

  //           .searchArea {
  //             flex: 1 1 50%;
  //             order: 1;

  //             padding: 0.2rem 1rem;
  //           }

  //           .accountArea {
  //             flex: 0 0 auto;
  //             order: 2;

  //             display: initial;

  //             :global(.item) {
  //               padding-left: 0.5rem;
  //               padding-right: 0.5rem;
  //             }
  //           }
  //         }
  //       }
  //     `}</style>
  //   </div>
}

Navbar.defaultProps = defaultProps

export default Navbar
