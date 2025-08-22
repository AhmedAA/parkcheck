import dynamic from 'next/dynamic';

const MapLoader = dynamic(() => import('@/app/components/MapComponent'), {
    ssr: false,
    loading: () => (
        <div className="flex h-screen w-full items-center justify-center">
            <h2 className="text-xl font-semibold">Loading Map...</h2>
        </div>
    ),
});

export default MapLoader;