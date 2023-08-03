import { Latest, Finish, Participate, TabEnum, Dashboard } from 'components/IDO'
import DEFAULT_TOKEN_LIST from 'constants/token-lists/stellaswap.tokenlist.json'
import X_STELLA_Deposit from 'features/ido/locker/deposit'
import X_STELLA from 'constants/token-lists/x-stella.json'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { usexStellaVol } from 'features/xstella/hooks'
import { useTokenBalance } from 'state/wallet/hooks'
import { PriceContext } from 'contexts/priceContext'
import React, { useState, useContext } from 'react'
import { useActiveWeb3React } from '../../hooks'
import Typography from 'components/Typography'
import { Deposit } from 'components/xStella'
import Button from 'components/Button'
import { legacyList } from 'constants/ido'
import Image from 'components/Image'
import Head from 'next/head'
import { Token } from 'sdk'
import { formatNumberScale, formatNumberSimple, formatBalance, formatPercent } from 'functions'
import { useLocker as useLocker_FetchData } from 'hooks/ido/useLocker'
import { BigNumber } from 'ethers'

export default function IdoProject(): JSX.Element {
  const { chainId, account } = useActiveWeb3React()
  const xStellaVol = usexStellaVol()
  const priceData = useContext(PriceContext)
  const stellaPrice = priceData?.['stella']
  const pool = useLocker_FetchData(legacyList.idoID, account)

  const [tab, setTab] = useState<TabEnum>(TabEnum.LATEST)
  const token0 = DEFAULT_TOKEN_LIST.tokens[0]
  const token1 = X_STELLA.tokens[0]
  const stella = new Token(chainId, token0.address, token0.decimals, token0.symbol, token0.name)
  const tvl = useTokenBalance(token1.address, stella)?.toSignificant(18)

  const stellaTvlUSD = +tvl * stellaPrice
  const apr = xStellaVol / stellaTvlUSD

  const xStellaPrice = isNaN(+tvl / +formatNumberSimple(pool.xStellaSupply))
    ? 1
    : (+tvl / +formatNumberSimple(pool.xStellaSupply)).toFixed(4)

  const lockedTokens = pool?.info?.totalTokens ?? BigNumber.from('0')
  const userLockedAmount = pool?.userLockedAmount ?? BigNumber.from('0')

  return (
    <>
      <Head>
        <title>IDO | StellaSwap</title>
        <meta key="description" name="description" content="Eclipse" />
      </Head>

      <div className="flex container px-0 z-0 mx-auto -mt-72 justify-end h-[400px]"></div>
      <div className="container px-2 pb-0 mx-auto mb-10 -mt-48 md:px-0 md:mb-0">
        <div className="relative w-full">
          <div className={`grid grid-cols-1 md:grid-cols-12 gap-2 min-h-1/2`}>
            <div className="block mb-10"></div>
            <div className={`col-span-1 md:col-span-12`}>
              <div className={'md:p-6 mb-5 md:mb-10'}>
                <div className="flex flex-col items-center justify-between gap-5 pt-10 mb-10 md:col-start-1 md:col-end-3 md:mb-0 md:flex-row">
                  <div className="flex flex-col items-center md:flex-row">
                    <Image src="/images/ido-cm.svg" width="120px" height="120px" layout="fixed" alt="STELLA IDO" />
                    <div className="-mt-4 text-center md:text-left">
                      <Typography variant="hero" className={'font-bold text-white'}>
                        Launchpad
                      </Typography>
                      <p
                        className={'-mt-6 text-gray-400 text-lg'}
                      >{`Access new & promising project tokens launching on Moonbeam`}</p>
                    </div>
                  </div>
                  <div>
                    <a
                      target="_BLANk"
                      rel="noopener noreferrer"
                      href="https://stellaswap.medium.com/unveiling-launchpad-details-for-athos-finance-ido-4a726b5a42e0"
                    >
                      <Button
                        size="sm"
                        className="w-auto"
                        variant="filled"
                        color="glem"
                        // onClick={() => router.push(`${project.id}?tab=join`)}
                      >
                        How does it works?
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container grid items-start grid-cols-1 gap-10 mb-20 xl:grid-cols-3">
        <div>
          {/* mt-14 */}
          <div className="stella-bg-with-outline z-4 ido">
            <Tabs defaultIndex={1}>
              <div className="flex items-center justify-between p-4 pl-8 pr-8">
                <div>
                  <h3 className="text-lg font-bold text-white">Lock xSTELLA</h3>
                  <p className="-mt-1 text-gray-400">{`Access IDO projects by staking & earning!`}</p>
                </div>
                <div>
                  <Image
                    src="/images/tokens/xstella.png"
                    width="40px"
                    height="40px"
                    layout="fixed"
                    alt="xSTELLA LOGO"
                  />
                </div>
              </div>
              <TabList>
                <Tab>Get xSTELLA</Tab>
                <Tab>Deposit</Tab>
              </TabList>

              <TabPanel>
                <div className="pb-10 pl-10 pr-10">
                  <Deposit stellaTvl={parseFloat(tvl)} />
                </div>
              </TabPanel>
              <TabPanel>
                <div className="pb-10 pl-10 pr-10">
                  <X_STELLA_Deposit idoID={legacyList.idoID} xStellaApr={apr} xStellaPrice={xStellaPrice} />
                </div>
              </TabPanel>
            </Tabs>
          </div>
          {/* User Dashboard */}
          <Dashboard idoID={legacyList.idoID} />
        </div>
        <div className="xl:col-span-2">
          {/* <CustomTab onSelectTab={(selectedTab: TabEnum) => setTab(selectedTab)} /> */}
          {tab === TabEnum.LATEST && <Latest project={legacyList} />}
          {/* {tab === TabEnum.FINISH && <Finish />} */}
        </div>
      </div>

      {/* <Participate
        idoID={latest.idoID}
        xStellaPrice={xStellaPrice}
        lockedTokens={lockedTokens}
        userLockedAmount={userLockedAmount}
      /> */}
    </>
  )
}
