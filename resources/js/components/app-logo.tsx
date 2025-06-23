export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-18 items-center justify-center rounded-md text-sidebar-primary-foreground">
                <img src="/images/choose_right.jpeg" className="h-auto w-14 object-contain" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">تذكرتي</span>
            </div>
        </>
    );
}
