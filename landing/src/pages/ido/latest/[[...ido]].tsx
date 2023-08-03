import { useRouter } from 'next/router'
import { GoProjectSymlink } from 'react-icons/go'
//import { capitalizeFirstLetter } from 'utils/misc'
import Button from 'components/Button'
import { PiGlobeHemisphereWestDuotone } from 'react-icons/pi'
import { TbMoneybag } from 'react-icons/tb'
import { GoTrophy } from 'react-icons/go'
import { BsBookmark } from 'react-icons/bs'
import SocialConnects from 'components/SocialConnects'
import { useState } from 'react'
import { Tab } from '@headlessui/react'
import Typography from 'components/Typography'
import Image from 'next/image'

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function Ido() {
  const router = useRouter()
  const query = router?.query?.ido

  const tabs = [
    {
      title: 'Overview',
      description: 'Project Overview'
    },
    {
      title: 'Product',
      description: 'Product Overview'
    },
    {
      title: 'Business Model',
      description: 'Business Model Overview'
    },
    {
      title: 'Team',
      description: 'Team Overview'
    },
    {
      title: 'Token Utility',
      description: 'Token Utility Overview'
    }
  ]

  return (
    <>
      <div className="container px-2 pb-0 mx-auto mb-10 md:px-0 md:mb-0">
        <div className="relative w-full">
          <div>
            <div>
              <nav className="flex" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-3">
                  <li className="inline-flex items-center">
                    <a href="#" className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
                      <span className='text-gray-400'><GoProjectSymlink /></span>
                      <span>{`Projects`}</span>
                    </a>
                  </li>
                  <li aria-current="page">
                    <div className="flex items-center">
                      <svg className="w-3 h-3 mx-1 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4" />
                      </svg>
                      <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">{capitalizeFirstLetter(String(query))}</span>
                    </div>
                  </li>
                </ol>
              </nav>
            </div>
          </div>
          <div className='flex items-center justify-between mt-4'>
            <div className='x-stella'>
              <div>
                <Typography variant="h1">
                  {`Athos Finance`}
                </Typography>
                <Typography variant="h3">{`The first decentralized delta-one asset protocol on Moonbeam`}</Typography>
              </div>
            </div>
            <div className='flex gap-2'>
              <button className='bg-[#FED6F5] hover:bg-[#ffadeb] text-gray-700 p-2 rounded-md px-4' type="button">
                {`Pre-Seed`}
              </button>
              <button className='bg-[#C6E6F7] hover:bg-[#9fd8f4] text-gray-700 p-2 rounded-md px-4' type="button">
                {`DEX`}
              </button>
            </div>
          </div>
          <div className='flex items-center justify-between gap-2 mt-6'>
            <div className='bg-[#374151] rounded'>
              <svg width="800" height="500" viewBox="0 0 800 800" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="800" height="500" rx="4" fill="#374151" />
                <path fill-rule="evenodd" clip-rule="evenodd" d="M435.728 374.699C442.49 374.699 447.972 369.17 447.972 362.349C447.972 355.529 442.49 350 435.728 350C428.966 350 423.484 355.529 423.484 362.349C423.484 369.17 428.966 374.699 435.728 374.699ZM401.84 449.481H323.72C322.935 449.481 322.456 448.618 322.871 447.952L377.41 360.384C377.796 359.765 378.685 359.743 379.086 360.351C383.293 366.72 402.278 395.489 418.118 419.866L435.099 392.44C435.476 391.832 436.35 391.805 436.765 392.387L476.23 447.899C476.699 448.557 476.237 449.47 475.429 449.478L437.22 449.854L401.84 449.481Z" fill="#6B7280" />
              </svg>

            </div>
            <div className='w-2/5 bg-[#0d1126] py-8 px-8 rounded'>
              <div className='flex items-center justify-between'>
                <div className='flex flex-col'>
                  <span className='-mb-2 text-xl text-gray-300'>
                    {`Fundraise Goal`}
                  </span>
                  <span className='text-4xl font-bold text-white'>{`$500,000`}</span>
                </div>
                <div className='flex flex-center'>
                  <Image src="/images/ido/moonbeam.png" alt="moonbeam" width={50} height={50} className='rounded-full' />
                  <Image src="/images/ido/athos.png" alt={String(query)} width={50} height={50} className="rounded-full" />
                </div>
              </div>
              <div className='flex flex-col gap-0 mt-4 text-lg'>
                <div className='flex items-center justify-between'>
                  <span>{`Maximum Allocation`}</span>
                  <span>{`$10,000`}</span>
                </div>
                <div className='flex items-center justify-between'>
                  <span>{`Minimum Investment`}</span>
                  <span>{`$5,000`}</span>
                </div>
                <div className='flex items-center justify-between'>
                  <span>{`End Date`}</span>
                  <span>{`3 days`}</span>
                </div>
                <div className='mt-6 mb-6'>
                  <Button variant="filled" color="stella">
                    {`Back this Project`}
                  </Button>
                </div>
                <div className='flex items-center justify-between'>
                  <div>
                    <Button variant="outlined" size="xs" color="glem" className='flex items-center gap-2 px-4 rounded-[3px]'><BsBookmark />{`Remind me`}</Button>
                  </div>
                  <div className='flex items-center justify-center gap-2'>
                    <SocialConnects facebook="#" twitter="#" email="#" code="#" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='flex justify-around bg-[#0d1126] mt-10 rounded-md py-10 items-center'>
            <div className='flex flex-col items-center justify-center gap-2 text-center w-60'>
              <span className='text-4xl text-white'><PiGlobeHemisphereWestDuotone /></span>
              <span>{`We connect builders with backers through auctions`}</span>
            </div>
            <div className='flex flex-col items-center justify-center gap-2 text-center w-60'>
              <span className='text-4xl text-white'><TbMoneybag /></span>
              <span>
                {`You make money even when you're outbid`}
              </span>
            </div>
            <div className='flex flex-col items-center justify-center gap-2 text-center w-60'>
              <span className='text-4xl text-white'><GoTrophy /></span>
              <span>
                {`More participants & better price discovery means everyone wins`}

              </span>
            </div>
          </div>
          <div className='w-2/3 mt-8'>
            <Tab.Group>
              <Tab.List className="flex p-1 space-x-1 rounded-xl bg-[#0d1126]/60">
                {Object.values(tabs).map((tab, id) => (
                  <Tab
                    key={id}
                    className={({ selected }) =>
                      classNames(
                        'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700',
                        '',
                        selected
                          ? 'bg-[#301747] shadow text-white font-bold'
                          : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                      )
                    }
                  >
                    {tab.title}
                  </Tab>
                ))}
              </Tab.List>
              <Tab.Panels className="mt-2">
                {Object.values(tabs).map((tab, idx) => (
                  <Tab.Panel
                    key={idx}
                    className={classNames(
                      'rounded-xl bg-[#0d1126]/90 p-6',
                      'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
                    )}
                  >
                    <>
                      {tab?.description}
                    </>
                  </Tab.Panel>
                ))}
              </Tab.Panels>
            </Tab.Group>
          </div>
        </div>
      </div>

    </>
  )
}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}
