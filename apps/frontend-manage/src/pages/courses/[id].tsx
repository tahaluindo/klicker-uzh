import { useQuery } from '@apollo/client'
import { faPencil } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { GetSingleCourseDocument } from '@klicker-uzh/graphql/dist/ops'
import Markdown from '@klicker-uzh/markdown'
import { Button, H1, H3 } from '@uzh-bf/design-system'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { SESSION_STATUS } from 'shared-components/src/constants'
import Leaderboard from 'shared-components/src/Leaderboard'
import CourseDescription from '../../components/courses/CourseDescription'
import LearningElementTile from '../../components/courses/LearningElementTile'
import MicroSessionTile from '../../components/courses/MicroSession'
import SessionTile from '../../components/courses/SessionTile'
import Layout from '../../components/Layout'

function CourseOverviewPage() {
  const router = useRouter()
  const [descriptionEditMode, setDescriptionEditMode] = useState(false)

  const {
    loading: loadingCourse,
    error: errorCourse,
    data: dataCourse,
  } = useQuery(GetSingleCourseDocument, {
    variables: { courseId: router.query.id as string },
  })

  if (loadingCourse) return <div>Loading...</div>
  if ((!dataCourse && !loadingCourse) || errorCourse) {
    router.push('/404')
  }

  const sortingOrderSessions: Record<string, number> = {
    [SESSION_STATUS.RUNNING]: 0,
    [SESSION_STATUS.SCHEDULED]: 1,
    [SESSION_STATUS.PREPARED]: 2,
    [SESSION_STATUS.COMPLETED]: 3,
  }

  return (
    <Layout>
      <div className="w-full mb-4">
        <div className="flex flex-row items-center justify-between">
          <H1>Kurs: {dataCourse?.course?.name}</H1>
        </div>
        {dataCourse?.course?.description ? (
          descriptionEditMode ? (
            <CourseDescription
              description={dataCourse?.course?.description}
              courseId={router.query.id as string}
              submitText="Beschreibung speichern"
              setDescriptionEditMode={setDescriptionEditMode}
            />
          ) : (
            <div className="flex flex-row gap-2 border border-solid rounded border-uzh-grey-80">
              <Markdown
                content={dataCourse.course.description}
                className="w-full p-2 rounded"
              />
              <Button
                onClick={() => setDescriptionEditMode(true)}
                className="h-10"
              >
                <Button.Icon>
                  <FontAwesomeIcon icon={faPencil} />
                </Button.Icon>
              </Button>
            </div>
          )
        ) : (
          <CourseDescription
            description={dataCourse?.course?.description ?? '<br>'}
            courseId={router.query.id as string}
            submitText="Beschreibung hinzufügen"
            setDescriptionEditMode={setDescriptionEditMode}
          />
        )}
      </div>
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-2/3 md:border-r-[0.1rem] md:border-solid md:border-uzh-grey-80">
          <div className="mb-4">
            <H3>Sessionen</H3>
            {dataCourse?.course?.sessions &&
            dataCourse.course.sessions.length > 0 ? (
              <div className="flex flex-col gap-2 overflow-x-scroll sm:flex-row">
                {dataCourse?.course?.sessions
                  .sort((a, b) => {
                    return (
                      sortingOrderSessions[a.status] -
                      sortingOrderSessions[b.status]
                    )
                  })
                  .map((session) => (
                    <SessionTile session={session} key={session.id} />
                  ))}
              </div>
            ) : (
              <div>Keine Sessionen vorhanden</div>
            )}
          </div>
          <div className="mb-4">
            <H3>Lernelemente</H3>
            {dataCourse?.course?.learningElements &&
            dataCourse.course.learningElements.length > 0 ? (
              <div className="flex flex-col gap-2 overflow-x-scroll sm:flex-row">
                {dataCourse?.course?.learningElements.map((learningElement) => (
                  <LearningElementTile
                    learningElement={learningElement}
                    key={learningElement.id}
                  />
                ))}
              </div>
            ) : (
              <div>Keine Lernelemente vorhanden</div>
            )}
          </div>
          <div className="mb-4">
            <H3>Micro-Sessions</H3>
            {dataCourse?.course?.microSessions &&
            dataCourse.course.microSessions.length > 0 ? (
              <div className="flex flex-col gap-2 overflow-x-scroll sm:flex-row">
                {dataCourse?.course?.microSessions.map((microSession) => (
                  <MicroSessionTile
                    microSession={microSession}
                    key={microSession.id}
                  />
                ))}
              </div>
            ) : (
              <div>Keine Micro-Sessions vorhanden</div>
            )}
          </div>
        </div>
        <div className="w-full md:w-1/3 md:pl-2">
          <H3>Kurs Leaderboard</H3>
          <Leaderboard leaderboard={dataCourse?.course?.leaderboard || []} />
        </div>
      </div>
    </Layout>
  )
}

export default CourseOverviewPage