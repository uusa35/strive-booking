import { getImage } from '@/constants';
import { SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';

export default function () {
    const { name } = usePage<SharedData>().props;
    return (
        <>
            <Head title="معهد سترايف">
                <meta name="description" content={'معهد سترايف التعليمي'} />
            </Head>
            <div className="relative isolate px-6 pt-14 lg:px-8">
                <div aria-hidden="true" className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
                    <div
                        style={{
                            clipPath:
                                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                        }}
                        className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#5eead4] to-[#14b8a6] opacity-80 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                    />
                </div>

                <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
                    <div className="text-center">
                        <img src={getImage('choose_right.jpeg')} className="mx-auto mb-6 size-40" />
                        <h1 className="text-prime-600 text-5xl font-semibold tracking-tight text-balance capitalize sm:text-7xl">{name}</h1>
                        <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8"></p>
                    </div>
                    <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                        <div className={`text-md relative rounded-full px-3 py-1 ${`text-gray-600`} ring-1 ring-gray-900/10 hover:ring-gray-900/20`}>
                            قريبـــــا
                        </div>
                    </div>
                </div>
                <div
                    aria-hidden="true"
                    className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
                >
                    <div
                        style={{
                            clipPath:
                                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                        }}
                        className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#5eead4] to-[#14b8a6] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
                    />
                </div>
            </div>
        </>
    );
}
