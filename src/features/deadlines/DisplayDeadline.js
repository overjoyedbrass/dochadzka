import React from 'react'
import { appTheme } from '../../helpers/themes'
import { useGetDeadlinesQuery } from '../api/deadlineSlice'

export const DisplayDeadline = ({date}) => {
    const month = date.getMonth();
    const year = date.getFullYear();

    const {
        data: deadlines={}
    } = useGetDeadlinesQuery(year)

    const day = deadlines.find(d => d.month === month)?.day
    
    return (<div className="impersonate-bar" style={{
            background: appTheme.palette.primary.main,
            color: "white",
            width: "100%"
        }}>
            Termín zadávania práceneschopnosti a dovolenky pre tento mesiac je do {day}. dňa
        </div>)
}