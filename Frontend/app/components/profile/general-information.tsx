export function GeneralInformation() {
  return (
    <div className="bg-white dark:bg-[#020817] rounded-2xl p-4 lg:p-6 shadow-sm">
      <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 lg:mb-6">General Information</h3>

      <div className="space-y-4 lg:space-y-6">
        <p className="text-gray-500 text-sm leading-relaxed">
          As we live, our hearts turn colder. Cause pain is what we go through as we become older. We get insulted by
          others, lose trust for those others. We get back stabbed by friends. It becomes harder for us to give others a
          hand. We get our heart broken by people we love, even that we give them all...
        </p>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Education</h4>
              <p className="text-sm text-gray-900 font-medium">Stanford University</p>
            </div>
            <div>
              <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Languages</h4>
              <p className="text-sm text-gray-900 font-medium">English, Spanish, Italian</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Department</h4>
              <p className="text-sm text-gray-900 font-medium">Product Design</p>
            </div>
            <div>
              <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Work History</h4>
              <p className="text-sm text-gray-900 font-medium">Google, Facebook</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Organization</h4>
              <p className="text-sm text-gray-900 font-medium">Simmple Web LLC</p>
            </div>
            <div>
              <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">Birthday</h4>
              <p className="text-sm text-gray-900 font-medium">20 July 1986</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
