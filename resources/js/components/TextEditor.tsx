import SunEditor, { buttonList } from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor"s CSS File

type Props = {
    name: string;
    setData: (data: any) => void;
    data: any;
    defaultValue?: string;
};
export function TextEditor({ setData, name, data, defaultValue }: Props) {
    const handleChange = (e: string) => {
        setData((data: any) => ({
            ...data,
            [`${name}`]: e,
        }));
    };

    return (
        <SunEditor
            defaultValue={defaultValue}
            onChange={(e: any) => handleChange(e)}
            setOptions={{
                height: `400`,
                buttonList: buttonList.complex,
            }}
        />
    );
}
