import React from 'react';

const EditDoctorPage: React.FC = () => {
  return (
    <div className="page-container">
     <div className="flex flex-col justify-center w-full md:w-1/2 p-20">
       <h1 className="text-5xl font-extrabold text-blue-900 mb-4 text-center md:text-left">
         Edit Doctor Here - Only for Admins
       </h1>
        {/* You can add form elements here later */}
     </div>
   </div>
  );
};

export default EditDoctorPage;
