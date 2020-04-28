import React, { useEffect } from 'react'
import classNames from 'classnames'
import { defineMessages, FormattedMessage } from 'react-intl'
import { Button, Checkbox, Icon, Message, Dropdown, Menu, Modal, Table } from 'semantic-ui-react'
import getConfig from 'next/config'
import { CSVLink } from 'react-csv'
import { pick } from 'ramda'

import QuestionBlock from '../questions/QuestionBlock'
import CancelModal from './CancelModal'
import QRPopup from './QRPopup'

const { publicRuntimeConfig } = getConfig()

const messages = defineMessages({
  buttonCloseBlock: {
    defaultMessage: 'Close current block',
    id: 'runningSession.button.closeBlock',
  },
  buttonFinish: {
    defaultMessage: 'Finish session',
    id: 'runningSession.button.finish',
  },
  buttonOpenBlock: {
    defaultMessage: 'Open next block',
    id: 'runningSession.button.openBlock',
  },
  buttonStart: {
    defaultMessage: 'Open first block',
    id: 'runningSession.button.start',
  },
  togglePublicEvaluation: {
    defaultMessage: 'Publish evaluation',
    id: 'runningSession.button.publicEvaluationToggle',
  },
  toggleParticipantAuthentication: {
    defaultMessage: 'Enforce authentication',
    id: 'runningSession.button.participantAuthenticationToggle',
  },
})

function getMessage(intl, num: number, max: number): any {
  if (num === 0) {
    return {
      icon: 'play',
      label: intl.formatMessage(messages.buttonStart),
    }
  }

  if (num % 2 === 1) {
    return {
      icon: 'right arrow',
      label: intl.formatMessage(messages.buttonCloseBlock),
    }
  }

  if (num === max) {
    return {
      icon: 'stop',
      label: intl.formatMessage(messages.buttonFinish),
    }
  }

  return {
    icon: 'right arrow',
    label: intl.formatMessage(messages.buttonOpenBlock),
  }
}

interface Props {
  activeStep: number
  blocks?: any[]
  handleCancelSession: () => void
  handleEndSession: () => void
  handleNextBlock: () => void
  handlePauseSession: () => void
  handleResetQuestionBlock: (instanceIds: string[]) => void
  handleTogglePublicEvaluation: () => void
  handleActivateBlockById: (blockId: number) => void
  intl: any
  isParticipantAuthenticationEnabled: boolean
  isEvaluationPublic?: boolean
  participants: any[]
  runtime?: string
  sessionId: string
  shortname: string
  startedAt?: string
  subscribeToMore: Function
}

const defaultProps = {
  blocks: [],
  isEvaluationPublic: false,
  isParticipantAuthenticationEnabled: false,
  participants: [],
  runtime: '00:00:00',
  startedAt: '00:00:00',
}

function SessionTimeline({
  sessionId,
  blocks,
  intl,
  runtime,
  startedAt,
  shortname,
  activeStep,
  participants,
  isEvaluationPublic,
  isParticipantAuthenticationEnabled,
  handleNextBlock,
  handleEndSession,
  handlePauseSession,
  handleCancelSession,
  handleTogglePublicEvaluation,
  handleResetQuestionBlock,
  handleActivateBlockById,
  subscribeToMore,
}: Props): React.ReactElement {
  useEffect((): void => {
    subscribeToMore()
  }, [])

  const isFeedbackSession = blocks.length === 0

  return (
    <div className="sessionTimeline">
      <div className="topRow">
        <div className="infos">
          <div className="startingTime">
            <Icon name="time" /> {startedAt}
          </div>
          <div className="runningTime">
            <Icon name="play circle" /> {runtime}
          </div>
        </div>

        <div className="actions">
          <QRPopup shortname={shortname} />
          <a href={`/join/${shortname}`} rel="noopener noreferrer" target="_blank">
            <Button icon labelPosition="left" size="small">
              <Icon name="external" />
              <FormattedMessage defaultMessage="Student View" id="sessionArea.toJoinSession" values={{ shortname }} />
            </Button>
          </a>
          <a href={`/sessions/evaluation/${sessionId}`} rel="noopener noreferrer" target="_blank">
            <Button icon disabled={isFeedbackSession} labelPosition="left" size="small">
              <Icon name="external" />
              <FormattedMessage defaultMessage="Evaluation (Results)" id="runningSession.button.evaluation" />
            </Button>
          </a>
          <Dropdown button simple className="icon small" icon="wrench">
            <Dropdown.Menu direction="left">
              <Dropdown.Header>
                <FormattedMessage defaultMessage="Link for Participants" id="runningSession.string.participantLink" />
              </Dropdown.Header>
              <Dropdown.Item>
                <a href={`${publicRuntimeConfig.baseUrl}/join/${shortname}`} rel="noopener noreferrer" target="_blank">
                  <Icon name="external" />
                  {publicRuntimeConfig.joinUrl
                    ? `${publicRuntimeConfig.joinUrl}/${shortname}`
                    : `${publicRuntimeConfig.baseUrl}/join/${shortname}`}
                </a>
              </Dropdown.Item>

              <Dropdown.Header>
                <FormattedMessage defaultMessage="Public Evaluation" id="runningSession.string.publicEvaluation" />
              </Dropdown.Header>
              <Dropdown.Item>
                <Checkbox
                  checked={isEvaluationPublic}
                  defaultChecked={isEvaluationPublic}
                  label={intl.formatMessage(messages.togglePublicEvaluation)}
                  onChange={handleTogglePublicEvaluation}
                />
              </Dropdown.Item>
              {isEvaluationPublic && (
                <Dropdown.Item>
                  <a href={`/sessions/public/${sessionId}`} rel="noopener noreferrer" target="_blank">
                    <Icon name="external" />
                    <FormattedMessage
                      defaultMessage="To Public Evaluation"
                      id="runningSession.button.publicEvaluation"
                    />
                  </a>
                </Dropdown.Item>
              )}

              {isParticipantAuthenticationEnabled && [
                <Dropdown.Header>
                  <FormattedMessage
                    defaultMessage="Participant Authentication"
                    id="runningSession.string.participantAuthentication"
                  />
                </Dropdown.Header>,
                // <Dropdown.Item>
                //   <Checkbox
                //     disabled
                //     checked={isParticipantAuthenticationEnabled}
                //     defaultChecked={isParticipantAuthenticationEnabled}
                //     label={intl.formatMessage(messages.toggleParticipantAuthentication)}
                //   />
                // </Dropdown.Item>,
                <Modal
                  trigger={
                    <Menu.Item icon>
                      <Icon name="table" />
                      <FormattedMessage defaultMessage="Participant List" id="runningSession.string.participantList" />
                    </Menu.Item>
                  }
                >
                  <Modal.Header>
                    <FormattedMessage defaultMessage="Participant List" id="runningSession.string.participantList" />
                  </Modal.Header>
                  <Modal.Content>
                    <Table celled>
                      <Table.Header>
                        <Table.Row>
                          <Table.HeaderCell>
                            <FormattedMessage defaultMessage="Username" id="common.string.username" />
                          </Table.HeaderCell>
                          <Table.HeaderCell>
                            <FormattedMessage defaultMessage="Password" id="common.string.password" />
                          </Table.HeaderCell>
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        {participants.map(({ username, password }) => (
                          <Table.Row>
                            <Table.Cell>{username}</Table.Cell>
                            <Table.Cell>
                              <span className="password">{password}</span>
                            </Table.Cell>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table>
                  </Modal.Content>

                  <Modal.Actions>
                    <CSVLink
                      data={participants.map(pick(['username', 'password']))}
                      filename="participants.csv"
                      headers={[
                        { label: 'username', key: 'username' },
                        { label: 'password', key: 'password' },
                      ]}
                    >
                      <Button icon>
                        <Icon name="file" />
                        Download (CSV)
                      </Button>
                    </CSVLink>
                  </Modal.Actions>
                </Modal>,
              ]}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      <div className="blocks">
        {blocks.map(
          (block, index): React.ReactElement => (
            <div className="blockWrap">
              <div className={classNames('waiting', { first: index === 0 })}>
                <Icon
                  color={index === activeStep / 2 ? 'green' : undefined}
                  name={index === 0 ? 'video play' : 'pause circle outline'}
                  size="big"
                />
              </div>
              <div className="block" key={block.id}>
                <QuestionBlock
                  expiresAt={block.expiresAt}
                  handleActivateQuestionBlock={(): void => handleActivateBlockById(block.id)}
                  handleResetQuestionBlock={(): void => handleResetQuestionBlock(block.id)}
                  index={index + 1}
                  questionBlockId={block.id}
                  questions={block.instances.map(({ id, question, version }): any => ({
                    id,
                    title: question.title,
                    type: question.type,
                    version,
                  }))}
                  sessionId={sessionId}
                  status={block.status}
                  timeLimit={block.timeLimit}
                />
              </div>
              {index === blocks.length - 1 && (
                <div className="waiting last">
                  <Icon
                    color={activeStep === blocks.length * 2 ? 'red' : undefined}
                    name="stop circle outline"
                    size="big"
                  />
                </div>
              )}
            </div>
          )
        )}
        {isFeedbackSession && (
          <div className="blockWrap">
            <Message info>
              <FormattedMessage
                defaultMessage="This feedback session does not contain any questions."
                id="runningSession.message.feedbackSession"
              />
            </Message>
          </div>
        )}
      </div>
      <div className="buttons">
        <div className="left">
          {!isParticipantAuthenticationEnabled && (
            <Button icon labelPosition="left" size="small" onClick={handlePauseSession}>
              <Icon name="pause" />
              <FormattedMessage defaultMessage="Pause Session" id="sessionArea.button.pauseSession" />
            </Button>
          )}
          <CancelModal handleCancelSession={handleCancelSession} />
        </div>

        {isFeedbackSession ? (
          <Button
            // show the session finish button for feedback sessions
            color="red"
            content={getMessage(intl, 2, 2).label}
            icon={getMessage(intl, 2, 2).icon}
            labelPosition="left"
            onClick={handleEndSession}
          />
        ) : (
          <Button
            // show dynamic buttons for all other sessions
            color={activeStep === blocks.length * 2 ? 'red' : 'blue'}
            content={getMessage(intl, activeStep, blocks.length * 2).label}
            icon={getMessage(intl, activeStep, blocks.length * 2).icon}
            labelPosition="left"
            onClick={activeStep >= blocks.length * 2 ? handleEndSession : handleNextBlock}
          />
        )}
      </div>
      <style jsx>
        {`
          @import 'src/theme';

          span.password {
            font-family: Courier new, serif;
          }

          .sessionTimeline {
            display: flex;
            flex-direction: column;

            .topRow {
              flex: 1;

              justify-content: space-between;
            }

            .topRow,
            .infos,
            .actions {
              display: flex;
              flex-flow: row wrap;
              align-items: flex-end;
            }

            .actions > a:last-child > :global(button) {
              margin: 0;
            }

            .runningTime {
              margin-left: 2rem;
            }

            .popupContent {
              display: flex;
              flex-direction: column;
              align-items: center;

              .qr {
                margin-bottom: 1rem;
                text-align: center;
              }
            }

            .blocks {
              flex: 1;

              display: flex;
              flex-direction: column;

              border: 1px solid lightgray;
              padding: 1rem;
            }

            .blockWrap {
              display: flex;
              flex-direction: column;
              align-items: center;
              min-height: 200px;

              background: linear-gradient(
                to right,
                transparent 0%,
                transparent calc(50% - 1.01px),
                lightgrey calc(50% - 1px),
                lightgrey calc(50% + 1px),
                transparent calc(50% + 1.01px),
                transparent 100%
              );

              .block {
                flex: 1;
                width: 100%;
              }

              .waiting {
                margin: 0.2rem 0;
                padding: 0.5rem 0;

                &.first {
                  padding-top: 0;
                  margin-top: 0;
                }

                &.last {
                  padding-bottom: 0;
                  margin-bottom: 0;
                }

                :global(i) {
                  background-color: white;
                  color: lightgrey;
                  margin-right: 0;
                }

                :global(i.green) {
                  color: green;
                }

                :global(i.red) {
                  color: red;
                }
              }
            }

            .buttons {
              flex: 1;

              display: flex;
              flex-flow: row wrap;
              justify-content: space-between;
              align-items: flex-start;

              margin-top: 0.5rem;

              > :global(button) {
                margin-right: 0;
              }

              .publicEvaluation {
                display: flex;
                flex-flow: row wrap;

                a {
                  margin-left: 1rem;
                }
              }
            }

            @include desktop-tablet-only {
              flex-flow: row wrap;

              .topRow {
                flex: 0 0 100%;

                padding-bottom: 0.5rem;
              }

              .blocks {
                flex: 0 0 100%;

                flex-direction: row;

                padding: 0.5rem;

                overflow-x: auto;
                overflow-y: visible;
              }

              .blockWrap {
                flex-direction: row;
                background: linear-gradient(
                  to bottom,
                  transparent 0%,
                  transparent calc(50% - 0.81px),
                  lightgrey calc(50% - 0.8px),
                  lightgrey calc(50% + 0.8px),
                  transparent calc(50% + 0.81px),
                  transparent 100%
                );

                .block,
                .block:not(:first-child) {
                  margin: 0.3rem;
                  width: 17rem;
                }

                .waiting {
                  margin: 0 0.2rem;
                  padding: 0 0.7rem;

                  &.first {
                    padding-left: 0;
                    margin-left: 0;
                  }

                  &.last {
                    padding-right: 0;
                    margin-right: 0;
                  }
                }
              }
            }
          }
        `}
      </style>
    </div>
  )
}

SessionTimeline.defaultProps = defaultProps

export default SessionTimeline