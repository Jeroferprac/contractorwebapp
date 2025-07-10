interface ProfileStatsProps {
  posts: number
  followers: string
  following: number
}

export function ProfileStats({ posts, followers, following }: ProfileStatsProps) {
  return (
    <div className="flex flex-wrap gap-8 mt-6 pt-6 border-t dark:bg-[#020817]">
      <div className="text-center">
        <div className="text-2xl font-bold text-gray-900">{posts}</div>
        <div className="text-sm text-gray-500">Posts</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-gray-900">{followers}</div>
        <div className="text-sm text-gray-500">Followers</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-gray-900">{following}</div>
        <div className="text-sm text-gray-500">Following</div>
      </div>
    </div>
  )
}
