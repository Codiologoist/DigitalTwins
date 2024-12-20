import { RowData } from "../types/types";
import RowComponent from "./RowComponent"; // Choose to use different drawing methods
//import RowComponent from "./RowComponent_alternative"; // Choose to use different drawing methods

interface PatientSignalsProps {
    rowData: RowData[];
}

const PatientSignals: React.FC<PatientSignalsProps> = ({rowData}) => {
    return (
        <div className="grid grid-cols-1 auto-rows-auto gap-2 overflow-auto h-screen bg-black">
            {rowData.map((row, index) => (
                <RowComponent
                key={index}
                title={row.title}
                unit={row.unit}
                color={row.color}
                data={row.data}
                optionPart={row.optionPart}
                numberColor={row.numberColor}
                />
            ))}
        </div>
    )
}

export default PatientSignals;