import { ArrowPathIcon, CloudArrowUpIcon, FingerPrintIcon, LockClosedIcon } from '@heroicons/react/24/outline'

const features = [
  {
    name: 'Save for future orders',
    description:
      'Easily save your favorite meals and plans for future grocery orders.',
    icon: CloudArrowUpIcon,
  },
  {
    name: 'Generate new ideas',
    description:
      'Generate new ideas based on your preferences if you are looking for new inspiration.',
    icon: ArrowPathIcon,
  },
  {
    name: 'Dietary preferences',
    description:
      'Customize your plans based on your dietary needs and preferences.',
    icon: FingerPrintIcon,
  },
  {
    name: 'Reduce food waste',
    description:
      'Curate a list of common ingredients to reduce common food waste in traditional adhoc meal planning.',
    icon: LockClosedIcon,
  },
]

export default function Content() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base/7 font-semibold text-indigo-600">Plan faster</h2>
          <p className="mt-2 text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl lg:text-balance">
            Weekly meal planning made easy
          </p>
          <p className="mt-6 text-lg/8 text-gray-600">
            We offer simple-to-use weekly meal planning for the whole family.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base/7 font-semibold text-gray-900">
                  <div className="absolute left-0 top-0 flex size-10 items-center justify-center rounded-lg bg-indigo-600">
                    <feature.icon aria-hidden="true" className="size-6 text-white" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base/7 text-gray-600">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}
