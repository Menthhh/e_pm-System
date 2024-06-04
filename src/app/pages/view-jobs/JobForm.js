"use client";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import InfoIcon from '@mui/icons-material/Info';
import Select from 'react-select';
import { useState } from 'react';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

const JobForm = (
    {
        jobData,
        jobItems,
        machines,
        machineName,
        handleInputChange,
        handleBeforeValue,
        handleWdChange,
        handleSubmit,
        handleShowJobItemDescription,
        handleShowTestMethodDescription,
        toggleJobItem,
        isShowJobItem,
        toggleJobInfo,
        isShowJobInfo,
        view,
        toggleAddComment

    }
) => {
    const [showWebcam, setShowWebcam] = useState(false);

    const handleAddImages = () => {
        setShowWebcam(true);
    };

    const handleCloseWebcam = () => {
        setShowWebcam(false);
    };
    console.log(jobData)
    return (
        <form className="flex flex-col gap-8"
            onSubmit={handleSubmit}
        >
            <h1 className="text-3xl font-bold text-primary flex items-center cursor-pointer" onClick={toggleJobInfo}>
                Job Information
                {isShowJobInfo ? <ArrowDropUpIcon className="size-14" /> : <ArrowDropDownIcon className="size-14" />}
            </h1>
            <div className={`grid grid-cols-4 ipadmini:grid-cols-4 gap-x-6 w-full gap-y-2 ${isShowJobInfo ? "" : "hidden"}`}>
                <div className="flex flex-col">
                    <label htmlFor="text-input" className="text-sm ipadmini:text-md font-bold text-gray-600">Job Id</label>
                    <input type="text" id="disabled-input" aria-label="disabled input" className="mb-5 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed" value={jobData.JobID} disabled />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="text-input" className="text-sm ipadmini:text-md font-bold text-gray-600">Job Name</label>
                    <input type="text" id="disabled-input" aria-label="disabled input" className="mb-5 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed" value={jobData.Name} disabled />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="text-input" className="text-sm ipadmini:text-md font-bold text-gray-600">Document No.</label>
                    <input type="text" id="disabled-input" aria-label="disabled input" className="mb-5 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed" value={jobData.DocumentNo} disabled />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="text-input" className="text-sm ipadmini:text-md font-bold text-gray-600">Checklist Version</label>
                    <input type="text" id="disabled-input" aria-label="disabled input" className="mb-5 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed" value={jobData.ChecklistVer} disabled />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="text-input" className="text-sm ipadmini:text-md font-bold text-gray-600">Workgroup Name</label>
                    <input type="text" id="disabled-input" aria-label="disabled input" className="mb-5 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed" value={jobData.WorkgroupName} disabled />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="text-input" className="text-sm ipadmini:text-md font-bold text-gray-600">Activated By</label>
                    <input type="text" id="disabled-input" aria-label="disabled input" className="mb-5 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed" value={jobData.ActivatedBy} disabled />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="text-input" className="text-sm ipadmini:text-md font-bold text-gray-600">Timeout</label>
                    <input type="text" id="disabled-input" aria-label="disabled input" className="mb-5 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed" value={jobData.Timeout} disabled />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="text-input" className="text-sm ipadmini:text-md font-bold text-gray-600">Activated At</label>
                    <input type="text" id="disabled-input" aria-label="disabled input" className="mb-5 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed" value={jobData.ActivatedAt} disabled />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="text-input" className="text-sm ipadmini:text-md font-bold text-gray-600">Status</label>
                    <input type="text" id="disabled-input" aria-label="disabled input" className="mb-5 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed" value={jobData.Status} disabled />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="text-input" className="text-sm ipadmini:text-md font-bold text-gray-600">WD Tag</label>
                    {
                        view === "true" ?
                            <input type="text" id="disabled-input" aria-label="disabled input" className="mb-5 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed"
                                value={jobData.WD_TAG}
                                disabled />
                            :
                            (jobData.WD_TAG ?
                                <Select
                                    className="mb-5"
                                    options={machines.map((item) => ({
                                        value: item.wd_tag,
                                        label: item.wd_tag
                                    }))}
                                    onChange={(selectedOption) => handleWdChange(selectedOption)}
                                    name="wd_tag"

                                    value={{ value: jobData.WD_TAG, label: jobData.WD_TAG }}
                                    disabled
                                />
                                :
                                <Select
                                    className="mb-5"
                                    options={machines.map((item) => ({
                                        value: item.wd_tag,
                                        label: item.wd_tag
                                    }))}
                                    onChange={(selectedOption) => handleWdChange(selectedOption)}
                                    name="wd_tag"
                                />)
                    }


                </div>
                <div className="flex flex-col">
                    <label htmlFor="text-input" className="text-sm ipadmini:text-md font-bold text-gray-600">Machine Name</label>
                    {
                        view === "true" ?
                        (
                            jobData.MachineName ?
                            <input type="text" id="disabled-input" aria-label="disabled input" className="mb-5 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed"
                                value={jobData.MachineName}
                                disabled />:
                            <input type="text" id="disabled-input" aria-label="disabled input" className="mb-5 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed"/>
                        ):
                       <input type="text" id="disabled-input" aria-label="disabled input" className="mb-5 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed" value={machineName} disabled />
                    }
                </div>

            </div>
            <hr />
            <div className="flex flex-col gap-8">
                <h1 className="text-3xl font-bold text-primary flex items-center cursor-pointer" onClick={toggleJobItem}>
                    Job Items Information
                    {isShowJobItem ? <ArrowDropUpIcon className="size-14" /> : <ArrowDropDownIcon className="size-14" />}
                </h1>
                <div className={`overflow-x-auto ${isShowJobItem ? "" : "hidden"} flex flex-col gap-5`}>
                    <table className="table-auto border-collapse w-full text-sm">
                        <thead className="text-center">
                            <tr className="bg-gray-200">
                                <th className="w-[50px]">Item Title </th>
                                <th className="w-[50px] px-4 py-2">
                                    Test Method
                                </th>
                                <th className="w-[50px] px-4 py-2">Lower Spec</th>
                                <th className="w-[50px] px-4 py-2">Upper Spec</th>
                                <th className="w-[150px] py-2">Before Value</th>
                                <th className="w-[150px] px-4 py-2">Actual Value</th>
                                <th className="w-[5px] py-2">Add images</th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {jobItems.map((item, index) => (
                                <tr key={index}>
                                    <td className="border px-4 py-2 relative">
                                        <div>{item.JobItemTitle} </div>

                                        <InfoIcon
                                            className="absolute right-1 top-1 text-blue-600 size-4 cursor-pointer "
                                            onClick={() => handleShowJobItemDescription(item)}

                                        />
                                    </td>
                                    <td className="border px-4 py-2 relative">
                                        <div>{item.TestMethod} </div>

                                        <InfoIcon
                                            className="absolute right-1 top-1 text-blue-600 size-4 cursor-pointer "
                                            onClick={() => handleShowTestMethodDescription(item)}

                                        />
                                    </td>
                                    <td className="border px-4 py-2">{item.UpperSpec}</td>
                                    <td className="border px-4 py-2">{item.LowerSpec}</td>
                                    <td className="border  py-2 relative">
                                        { //if view is true then disable the input field
                                            view === "true" ?
                                                <input type="text" id={`before_value_${item.JobItemID}`} value={item.BeforeValue} className=" bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 text-center w-3/4 p-1.5 cursor-not-allowed" disabled />
                                                :
                                                (item.BeforeValue ?
                                                    <input type="text" id={`before_value_${item.JobItemID}`} value={item.BeforeValue} className=" bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 text-center w-3/4 p-1.5 cursor-not-allowed" disabled />
                                                    :
                                                    <input
                                                        type="text"
                                                        id={`before_value_${item.JobItemID}`}
                                                        onChange={(e) => handleBeforeValue(e, item)}
                                                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-sm ring-secondary ring-1 focus:ring-blue-500 focus:border-blue-500  w-full p-1.5"
                                                        placeholder="fill in value"
                                                    />
                                                )
                                        }

                                    </td>
                                    <td className="border px-4 py-2 relative">
                                        { //if view is true then disable the input field
                                            view === "true" ? <input type="text" id={`actual_value_${item.JobItemID}`} value={item.ActualValue} className=" bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 text-center w-3/4 p-1.5 cursor-not-allowed"
                                                disabled />
                                                : (
                                                    item.ActualValue ?
                                                        <input type="text" id={`actual_value_${item.JobItemID}`} value={item.ActualValue} className=" bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 text-center w-3/4 p-1.5 cursor-not-allowed"
                                                            disabled />
                                                        :
                                                        <input
                                                            type="text"
                                                            id={`actual_value_${item.JobItemID}`}
                                                            onChange={(e) => handleInputChange(e, item)}
                                                            className="bg-white border border-gray-300 text-gray-900 text-sm ring-secondary ring-1 focus:ring-blue-500 focus:border-blue-500  w-full p-1.5 rounded-lg"
                                                            placeholder="fill in value"
                                                        />
                                                )

                                        }
                                        <InfoIcon
                                            className="absolute right-[2px] top-1 text-blue-600 size-4 cursor-pointer"
                                            onClick={() => toggleAddComment(item)}

                                        />
                                    </td>
                                    <td className="border py-2 relative">
                                        <CameraAltIcon className="text-blue-600 size-8 cursor-pointer" onClick={handleAddImages} />
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div>
                    {view === "true" || jobData.Status === "complete" ?
                        null
                        :
                        <button type="submit" className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-14 py-3 bg-primary text-base font-medium text-white hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                            Submit
                        </button>
                    }
                </div>
            </div>
            {/* <Modal
                open={showWebcam}
                onClose={handleCloseWebcam}
            >
                <Box className="fixed inset-0 flex items-center justify-center z-50 w-screen h-screen">
                    <WebcamEditted handleCloseWebcam={handleCloseWebcam} />
                </Box>

            </Modal> */}

        </form>
    )

}

export default JobForm;