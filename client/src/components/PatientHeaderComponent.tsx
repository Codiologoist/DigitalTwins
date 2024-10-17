import { FaUser } from "react-icons/fa";
import { Patient } from "../types/types.ts";

interface PatientHeaderProps {
    patient: Patient;
}

const PatientHeader: React.FC<PatientHeaderProps> = ({patient}) => {
    return (
        <div className="text-lg p-4 pt-20 flex items-center space-x-2 text-white shadow-lg rounded-lg border-2 border-gray-900">
            <FaUser/>
            <h1 className="font-bold ">
                Patient:  {patient.firstName} {patient.lastName}
            </h1>
        </div>
    )
}

export default PatientHeader;