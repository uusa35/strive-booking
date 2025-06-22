import { User } from '@/types';

export default function ({ user }: { user: User }) {
    return (
        <div className="w-full space-y-3">
            <div className="flex flex-row gap-3">
                <div className="w-30">الاسم بالكامل</div>
                <div>:</div>
                <div>{user.full_name}</div>
            </div>
            <div className="flex flex-row gap-3">
                <div className="w-30">الموبايل</div>
                <div>:</div>
                <div>{user.mobile}</div>
            </div>
            <div className="flex flex-row gap-3">
                <div className="w-30">نوع الحساب</div>
                <div>:</div>
                <div>{user.type}</div>
            </div>
            <div className="flex flex-row gap-3">
                <div className="w-30">المرحلة التعليمية</div>
                <div>:</div>
                <div>{user.academic_interest}</div>
            </div>
            <div className="flex flex-row gap-3">
                <div className="w-30">اهتمامك الدراسي</div>
                <div>:</div>
                <div>{user.stage}</div>
            </div>
            <div className="flex flex-row gap-3">
                <div className="w-30 text-xs"> مسلسل الحساب</div>
                <div>:</div>
                <div>{user.id}</div>
            </div>
        </div>
    );
}
