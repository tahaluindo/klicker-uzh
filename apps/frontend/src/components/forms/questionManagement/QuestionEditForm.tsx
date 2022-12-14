import React, { useState, useEffect, useMemo } from 'react'
import _isEmpty from 'lodash/isEmpty'
import _isNumber from 'lodash/isNumber'
import getConfig from 'next/config'
import { defineMessages, FormattedMessage, useIntl } from 'react-intl'
import { Button, Form, Dropdown, Message, Icon } from 'semantic-ui-react'
import { Formik } from 'formik'
import { equals, omit } from 'ramda'
import FocusLock, { AutoFocusInside } from 'react-focus-lock'
import { is } from 'immutable'

import CustomTooltip from '../../common/CustomTooltip'
import { convertToSlate } from '../../../lib/utils/slateMdConversion'
import FileDropzone from './FileDropzone'
import FormikInput from '../components/FormikInput'
import { generateTypesLabel } from '../../../lib/utils/lang'
import ContentInput from '../../questions/creation/ContentInput'
import TagInput from '../../questions/creation/TagInput'
import SCCreationOptions from '../../questionTypes/SC/SCCreationOptions'
import SCCreationPreview from '../../questionTypes/SC/SCCreationPreview'
import FREECreationOptions from '../../questionTypes/FREE/FREECreationOptions'
import FREECreationPreview from '../../questionTypes/FREE/FREECreationPreview'
import { QUESTION_TYPES, QUESTION_GROUPS } from '../../../constants'

const { publicRuntimeConfig } = getConfig()

const messages = defineMessages({
  contentEmpty: {
    defaultMessage: 'Please add a question.',
    id: 'form.editQuestion.content.empty',
  },
  minMaxRangeInvalid: {
    defaultMessage: 'Please specify a range from min to max.',
    id: 'form.editQuestion.options.minMaxRange.invalid',
  },
  optionsEmpty: {
    defaultMessage: 'Please add at least one answer option.',
    id: 'form.editQuestion.options.empty',
  },
  optionsInvalid: {
    defaultMessage: 'Invalid options',
    id: 'form.editQuestion.options.invalid',
  },
  tagsEmpty: {
    defaultMessage: 'Please add at least one tag.',
    id: 'form.editQuestion.tags.empty',
  },
  titleEmpty: {
    defaultMessage: 'Please add a question title.',
    id: 'form.editQuestion.title.empty',
  },
  titleInput: {
    defaultMessage: 'Question Title',
    id: 'editQuestion.titleInput.label',
  },
})

// form validation
const validate = ({ title, content, options, tags, type }): any => {
  const errors: any = {}

  if (!title || _isEmpty(title)) {
    errors.title = messages.titleEmpty
  }

  if (content.length === 1 && content[0].children[0].text === '') {
    errors.content = messages.contentEmpty
  }

  if (!tags || tags.length === 0) {
    errors.tags = messages.tagsEmpty
  }

  if (QUESTION_GROUPS.CHOICES.includes(type) && (!options || options.choices.length === 0)) {
    errors.options = messages.optionsEmpty
  }

  if (type === QUESTION_TYPES.FREE_RANGE) {
    if (options && options.restrictions) {
      const isMinNum = _isNumber(options.restrictions.min)
      const isMaxNum = _isNumber(options.restrictions.max)

      if (isMinNum && isMaxNum && options.restrictions.min >= options.restrictions.max) {
        errors.options = messages.minMaxRangeInvalid
      }
    } else {
      errors.options = messages.optionsInvalid
    }
  }

  return errors
}

interface Props {
  activeVersion: number
  editSuccess: any
  loading: boolean
  handleActiveVersionChange: any
  handleSubmit: any
  handleDiscard: () => void
  allTags: any[]
  title: string
  questionTags: any[]
  type?: string
  versions: any[]
}

const defaultProps = {
  tags: [],
  type: QUESTION_TYPES.SC,
}

const typeComponents = {
  [QUESTION_TYPES.SC]: {
    input: SCCreationOptions,
    preview: SCCreationPreview,
  },
  [QUESTION_TYPES.MC]: {
    input: SCCreationOptions,
    preview: SCCreationPreview,
  },
  [QUESTION_TYPES.FREE]: {
    input: FREECreationOptions,
    preview: FREECreationPreview,
  },
  [QUESTION_TYPES.FREE_RANGE]: {
    input: FREECreationOptions,
    preview: FREECreationPreview,
  },
}

function areValuesTheSame(initialValues: any, values: any) {
  const initialValuesWithoutContent = omit(['content'], initialValues)
  const valuesWithoutContent = omit(['content'], values)

  const initialContent = initialValues.content
  const { content } = values

  return equals(initialValuesWithoutContent, valuesWithoutContent) && is(initialContent, content)
}

function QuestionEditForm({
  activeVersion,
  editSuccess,
  loading,
  questionTags,
  title,
  type,
  allTags,
  handleSubmit,
  handleDiscard,
  handleActiveVersionChange,
  versions,
}: Props): React.ReactElement {
  const intl = useIntl()

  // if the active version would be out of array bounds, we are creating a new one
  const isNewVersion = activeVersion === versions.length

  // calculate the version with which to initialize the version fields (the current or last one)
  const initializeVersion = isNewVersion ? versions.length - 1 : activeVersion

  const content = useMemo(() => {
    console.log(versions[initializeVersion].content)
    return versions[initializeVersion].content
      ? convertToSlate(versions[initializeVersion].content)
      : convertToSlate(versions[initializeVersion].description)
  }, [versions, initializeVersion])

  const initialValues = {
    content,
    files: versions[initializeVersion].files || [],
    options: versions[initializeVersion].options[type] || {},
    tags: questionTags.map((tag): string => tag.name),
    title,
    type,
    versions,
  }

  const versionOptions = versions.map(({ id }, index): any => ({
    text: `v${index + 1}`,
    value: id,
  }))

  return (
    <FocusLock>
      <div className="questionEditForm">
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validate={validate}
          // validationSchema={Yup.object().shape({})}
          onSubmit={handleSubmit(isNewVersion)}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit: handleFormSubmit,
            setFieldValue,
            setFieldTouched,
            isSubmitting,
          }: any): React.ReactElement => {
            const OptionsInput = typeComponents[type].input
            const Preview = typeComponents[type].preview

            const { message, success } = editSuccess

            // use changed state to track changes in the editing process
            const [hasAnythingChanged, setHasAnythingChanged] = useState(false)

            useEffect(() => {
              setHasAnythingChanged(!areValuesTheSame(initialValues, values))
            }, [values])

            return (
              <Form error={success === false} success={success === true} onSubmit={handleFormSubmit}>
                <div className="actionArea">
                  {!hasAnythingChanged && (
                    <Button className="close" size="large" type="button" onClick={handleDiscard}>
                      <FormattedMessage defaultMessage="Close" id="common.button.close" />
                    </Button>
                  )}
                  {hasAnythingChanged && (
                    <Button className="discard" size="large" type="button" onClick={handleDiscard}>
                      <FormattedMessage defaultMessage="Discard" id="common.button.discard" />
                    </Button>
                  )}

                  <div className="infoMessage">
                    <Message compact success size="small">
                      <FormattedMessage defaultMessage="Successfully modified question." id="editQuestion.sucess" />
                    </Message>
                    <Message compact error size="small">
                      <FormattedMessage
                        defaultMessage="Could not modify question: {error}"
                        id="editQuestion.error"
                        values={{ error: message }}
                      />
                    </Message>
                  </div>

                  <Button
                    primary
                    className="save"
                    disabled={!_isEmpty(errors) || !hasAnythingChanged}
                    loading={loading && isSubmitting}
                    size="large"
                    type="submit"
                  >
                    <FormattedMessage defaultMessage="Save" id="common.button.save" />
                  </Button>
                </div>

                <div className="questionMeta">
                  <div className="questionInput questionType">
                    <Form.Field>
                      <label htmlFor="type">
                        <FormattedMessage defaultMessage="Question Type" id="editQuestion.type" />
                      </label>
                      <div className="type">{generateTypesLabel(intl)[type]}</div>
                    </Form.Field>
                  </div>

                  <div className="questionInput questionTitle">
                    <AutoFocusInside>
                      <FormikInput
                        required
                        /* error={errors.title}
                errorMessage={
                  <FormattedMessage
                    defaultMessage="Please provide a valid question title (summary)."
                    id="form.questionTitle.invalid"
                  />
                } */
                        handleBlur={handleBlur}
                        handleChange={handleChange}
                        label={intl.formatMessage(messages.titleInput)}
                        name="title"
                        tooltip={
                          <FormattedMessage
                            defaultMessage="Enter a short summarizing title for the question."
                            id="createQuestion.titleInput.tooltip"
                          />
                        }
                        touched={touched.title}
                        type="text"
                        value={values.title}
                      />
                    </AutoFocusInside>
                  </div>
                  <div className="questionInput questionTags">
                    <TagInput
                      tags={allTags}
                      touched={touched.tags}
                      value={values.tags}
                      onChange={(newTags): void => {
                        setFieldTouched('tags', true, false)
                        setFieldValue('tags', newTags)
                      }}
                    />
                  </div>
                </div>

                <div className="questionInput questionContent">
                  <div className="flex flex-row items-end space-between">
                    <label className="flex-1 header" htmlFor="content">
                      <FormattedMessage defaultMessage="Question" id="createQuestion.contentInput.label" />

                      <CustomTooltip
                        className={'!ml-2'}
                        content={
                          <FormattedMessage
                            defaultMessage="Enter the question you want to ask the audience. The rich text editor supports the following (block) styles: bold text, italic text, code, quotes, numbered lists, unnumbered lists and LaTeX formulas. Hover over the buttons for more detailed information."
                            id="createQuestion.contentInput.tooltip"
                          />
                        }
                        iconObject={
                          <a data-tip>
                            <Icon name="question circle" />
                          </a>
                        }
                      />
                    </label>

                    <Dropdown
                      text={isNewVersion ? `v${versionOptions.length + 1} (draft)` : `v${activeVersion + 1}`}
                      value={activeVersion}
                    >
                      <Dropdown.Menu>
                        <Dropdown.Item
                          active={isNewVersion}
                          onClick={(): void => handleActiveVersionChange(versionOptions.length)}
                        >
                          {`v${versionOptions.length + 1} (draft)`}
                        </Dropdown.Item>

                        {versionOptions
                          .map(
                            ({ id, text }: any, index): React.ReactElement => (
                              <Dropdown.Item
                                active={activeVersion === index}
                                key={id}
                                onClick={(): void => handleActiveVersionChange(index)}
                              >
                                {text}
                              </Dropdown.Item>
                            )
                          )
                          .reverse()}
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>

                  <ContentInput
                    activeVersion={activeVersion}
                    disabled={!isNewVersion}
                    error={errors.content}
                    touched={touched.content}
                    value={values.content}
                    versions={values.versions}
                    onChange={(newContent): void => {
                      setFieldTouched('content', true, false)
                      setFieldValue('content', newContent)
                    }}
                  />
                </div>

                {publicRuntimeConfig.s3root && (
                  <div className="questionInput questionFiles">
                    <h3>
                      <FormattedMessage defaultMessage="Attached Images" id="createQuestion.filesLabel" />
                    </h3>
                    <FileDropzone
                      disabled={!isNewVersion}
                      files={values.files}
                      onChangeFiles={(newFiles): void => {
                        setFieldTouched('files', true, false)
                        setFieldValue('files', newFiles)
                      }}
                    />
                  </div>
                )}

                <div className="questionInput questionOptions">
                  <OptionsInput
                    disabled={!isNewVersion}
                    type={values.type}
                    value={values.options}
                    onChange={(newOptions): void => {
                      setFieldTouched('options', true, false)
                      setFieldValue('options', newOptions)
                    }}
                  />
                </div>

                <div className="questionPreview">
                  <h2>
                    <FormattedMessage defaultMessage="Audience Preview" id="createQuestion.previewLabel" />
                  </h2>
                  <Preview description={values.content} options={values.options} questionType={values.type} />
                </div>
              </Form>
            )
          }}
        </Formik>

        <style jsx>{`
          @import 'src/theme';

          .questionEditForm > :global(form) {
            display: flex;
            flex-direction: column;

            .questionInput,
            .questionPreview {
              margin-bottom: 1rem;
            }

            .questionInput :global(label),
            .questionPreview > h2,
            .questionFiles > h2 {
              font-size: 1.2rem !important;
              font-weight: bold;
              margin: 0 !important;
              margin-bottom: 0.5rem !important;
            }
            .questionInput .header {
              margin-bottom: 0 !important;
            }

            .questionVersion {
              :global(.dropdown) {
                margin-left: 0.5rem;
              }
            }

            .questionVersion > :global(.field),
            .actionArea {
              display: flex;
              flex-direction: column;

              :global(button) {
                margin-right: 0;
              }
            }

            @supports (grid-gap: 1rem) {
              @include desktop-tablet-only {
                display: grid;
                align-content: start;

                grid-gap: 1rem;
                grid-template-columns: repeat(3, 1fr);
                grid-template-rows: auto;
                grid-template-areas:
                  'message message message'
                  'meta meta preview'
                  'meta meta preview'
                  'meta meta preview'
                  'version version preview'
                  'content content preview'
                  'files files files'
                  'options options options'
                  'actions actions actions';

                margin-top: -1rem;

                .questionInput,
                .questionPreview {
                  margin-bottom: 0;
                }

                .infoMessage {
                  grid-area: message;

                  > :global(.message) {
                    margin-bottom: 0;
                  }
                }

                .questionMeta {
                  grid-area: meta;
                  align-self: start;
                  display: flex;
                  flex-direction: column;
                  gap: 1rem;
                }

                .questionVersion {
                  grid-area: version;
                }

                .questionPreview {
                  grid-area: preview;
                  margin-bottom: 0;
                }

                .questionContent {
                  grid-area: content;
                }

                .questionFiles {
                  grid-area: files;
                }

                .questionOptions {
                  grid-area: options;
                }

                .actionArea {
                  grid-area: actions;
                  flex-direction: row;

                  justify-content: space-between;
                  align-items: start;

                  :global(.message) {
                    margin-right: 1rem;
                  }
                }
              }
            }
          }
        `}</style>
      </div>
    </FocusLock>
  )
}

QuestionEditForm.defaultProps = defaultProps

export default QuestionEditForm
