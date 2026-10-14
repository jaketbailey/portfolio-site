import Layout from '../components/Layout'
import Intro from '../components/Intro'
import Portfolio from '../components/Portfolio'
import Timeline from '../components/Timeline'

export default function Home() {
    return (
        <Layout>
            <div className="flex justify-center">
                <div className="max-w-5xl w-11/12 flex flex-wrap">
                    <div className="w-full md:w-1/2">
                        <Intro />
                        <Portfolio />
                    </div>
                    <div className="w-full md:w-1/2 ml-auto pb-6">
                        <Timeline />
                    </div>
                </div>
            </div>
        </Layout>
    )
}
