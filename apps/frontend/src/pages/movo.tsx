import React, { useState, useCallback, useContext } from 'react'
import { useMutation } from '@apollo/client'
import Image from 'next/image'
import { Button, Icon } from 'semantic-ui-react'
import { useDropzone } from 'react-dropzone'
import { useToasts } from 'react-toast-notifications'
import clsx from 'clsx'
import { push } from '@socialgouv/matomo-next'
import { useRouter } from 'next/router'

import { UserContext } from '../lib/userContext'
import MovoImportMutation from '../graphql/mutations/MovoImportMutation.graphql'
import LogoutMutation from '../graphql/mutations/LogoutMutation.graphql'
import KlickerLogoSrc from '../../public/KlickerUZH_Gray_Transparent.png'

function MovoImport(): React.ReactElement {
  const [movoImport] = useMutation(MovoImportMutation)
  const [movoJSON, setMovoJSON] = useState('')
  const [filename, setFilename] = useState('')
  const [submissionSucc, setSubmissionSucc] = useState(false)
  const { addToast } = useToasts()
  const [logout] = useMutation(LogoutMutation)
  const router = useRouter()
  const user = useContext(UserContext)

  const onDrop = useCallback((acceptedFiles): void => {
    const reader = new FileReader()

    reader.onload = (): void => {
      try {
        const stringMovoJSON = String(reader.result)
        setMovoJSON(stringMovoJSON)
      } catch (error) {
        addToast('Something went wront with your uploaded file. Plese try again or contact the support email below', {
          appearance: 'error',
          autoDismiss: false,
        })
      }
    }

    acceptedFiles.forEach((file): void => reader.readAsText(file, 'utf-8'))
    setFilename(acceptedFiles[0].name)
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    accept: ['text/plain', 'application/json'],
    onDrop,
  })

  const ConfirmationNote = () => {
    try {
      if (movoJSON !== '') {
        return (
          <div className="my-auto ml-3">
            Your upload of {JSON.parse(movoJSON).length} question sets has been successful. Please{' '}
            {/* eslint-disable jsx-a11y/no-static-element-interactions */
            /* eslint-disable jsx-a11y/click-events-have-key-events */}
            <div
              className="inline-block text-blue-800 cursor-pointer"
              onClick={async (): Promise<void> => {
                await logout()
                push(['trackEvent', 'User', 'Logged Out'])
                router.push('/')
              }}
            >
              log out now to avoid any conflicts during the migration process
            </div>{' '}
            and do not change any questions and/or sessions.
          </div>
        )
      }
    } catch (error) {
      console.log(error)
    }
    return null
  }

  return (
    <>
      <div className="flex m-4">
        <h1 className="flex-1">Movo.ch Import to KlickerUZH</h1>
        <div className="-mt-4">
          <Image alt="KlickerUZH Logo" height={66} src={KlickerLogoSrc} width={200} />
        </div>
      </div>

      <div className="mx-4 mb-2 -mt-2 font-bold">Signed in as: {user?.email}</div>

      <div className="mx-4">
        <div className="p-3 mb-3 border border-gray-500 border-solid rounded bg-primary-20">
          This page allows users to migrate seemlessly from movo.ch to KlickerUZH without loosing any questions or
          previously run question sets. Plase note that the migration can take up to a few hours to be completed and
          that you should not use your KlickerUZH account in the meantime to avoid conflicts in the data. Once the
          migration is completed, you will be notified by e-mail. Furthermore, please keep in mind that submitting the
          same file repeatably will result in duplicated questions in your question pool later on. Your questions from
          all question sets will be imported into the KlickerUZH question pool, question sets will be available (with
          results) as KlickerUZH sessions. Should you encounter any problems with the migration, please check out the
          corresponding{' '}
          <a
            className="inline-block text-blue-800 cursor-pointer"
            href="https://www.klicker.uzh.ch/movo"
            rel="noreferrer"
            target="_blank"
          >
            documentation page
          </a>
          .
        </div>
        <div className="flex flex-row flex-nowrap">
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <Button fluid icon primary disabled={submissionSucc} type="button">
              <div className="flex flex-row">
                <Icon className="!mr-4" name="plus" />
                <div>Select Movo Export</div>
              </div>
            </Button>
          </div>
          <div className="flex-1 pl-4 my-auto font-bold">Selected File: {filename}</div>
          <Button
            icon
            primary
            className="!bg-green-700 !max-h-11"
            disabled={movoJSON === '' || submissionSucc === true}
            onClick={async () => {
              try {
                await movoImport({
                  variables: { dataset: movoJSON },
                })
                setSubmissionSucc(true)
                push(['trackEvent', 'User', 'Migrated Data from Movo.ch'])
              } catch (error) {
                setSubmissionSucc(false)
                console.log(error)
                addToast(
                  'Unfortunately, an error occured during the submission of your export. Please try to upload a different file or contact the support above with your questions.',
                  { appearance: 'error' }
                )
              }
            }}
          >
            <div className="flex flex-row">
              <Icon className="!mr-4" name="upload" />
              <div>Confirm Upload</div>
            </div>
          </Button>
        </div>

        <div
          className={clsx(
            'flex-row p-3 mt-5 bg-green-400 border border-gray-500 border-solid rounded hidden',
            submissionSucc && '!flex'
          )}
        >
          <Icon name="checkmark" size="big" />
          {<ConfirmationNote />}
        </div>
      </div>
    </>
  )
}

export default MovoImport
