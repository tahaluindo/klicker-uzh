import { LeaderboardEntry } from '@klicker-uzh/graphql/dist/ops'
import Image from 'next/future/image'
import { useMemo } from 'react'
import { twMerge } from 'tailwind-merge'
import { ParticipantOther } from './Participant'

function SinglePodium({
  username,
  avatar,
  score,
  className,
  participantClassName,
}) {
  return (
    <div
      className={twMerge(
        'relative flex-1 md:border-b-4 bg-slate-300 md:border-slate-500',
        className
      )}
    >
      <ParticipantOther
        className={twMerge(
          'bg-white shadow outline-slate-400',
          participantClassName
        )}
        pseudonym={username}
        avatar={avatar}
        points={score ?? 0}
        withAvatar={!!avatar}
      />
      <div className="absolute left-0 right-0 bottom-1 top-10">
        <Image src="/medal.svg" fill />
      </div>
    </div>
  )
}

interface PodiumProps {
  leaderboard: LeaderboardEntry[]
}
export function Podium({ leaderboard }: PodiumProps) {
  const { rank1, rank2, rank3 } = useMemo(() => {
    if (!leaderboard) return {}
    return {
      rank1: leaderboard.length >= 1 && leaderboard[0],
      rank2: leaderboard.length >= 2 && leaderboard[1],
      rank3: leaderboard.length >= 3 && leaderboard[2],
    }
  }, [leaderboard])

  return (
    <div className="flex flex-col gap-4 md:items-end md:flex-row">
      <SinglePodium
        className="order-2 h-[80px] md:order-1"
        username={rank2?.username}
        avatar={rank2?.avatar}
        score={rank2?.score}
        participantClassName="outline-2 outline-[#b4b4b4]"
      />

      <SinglePodium
        className="order-1 h-[90px] md:order-2"
        username={rank1?.username}
        avatar={rank1?.avatar}
        score={rank1?.score}
        participantClassName="outline-2 outline-[#c9b037]"
      />

      <SinglePodium
        className="order-3 h-[70px]"
        username={rank3?.username}
        avatar={rank3?.avatar}
        score={rank3?.score}
        participantClassName="outline-2 outline-[#965A38]"
      />
    </div>
  )
}
