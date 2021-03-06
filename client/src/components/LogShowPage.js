import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX } from '@fortawesome/free-solid-svg-icons'
import LogEntryTile from "./LogEntryTile"
import NaturalSearchForm from "./NaturalSearchForm"
import SummaryChart from "./SummaryChart"
import CalorieChart from "./CalorieChart"
import getLogEntries from "../services/getLogEntries"
import postLogEntry from "../services/postLogEntry"
import deleteLogEntry from "../services/deleteLogEntry"
import patchLogEntry from "../services/patchLogEntry"

const LogShowPage = (props) => {
  const [log, setLog] = useState({
    userId: null,
    date: "",
    entries: [],
    total: {},
    macros: {}
  })
  const [shouldRedirect, setShouldRedirect] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  const [entryDetails, setEntryDetails] = useState({})
  const [errors, setErrors] = useState([])
  const { id } = useParams()
  let errorContainer
  let entryDetailDisplay
  
  if (errors.length > 0) {
    errorContainer = (
      <div className="post-error">
        {errors}
      </div>
    )
  }

  const handleExitClick = () => {
    setShowDetail(false)
  }

  if (showDetail) {
    entryDetailDisplay = (
      <div className="entry-detail-container">
        <FontAwesomeIcon
          className="detail-icon"
          icon={faX}
          onClick={handleExitClick}
        />
        <div className="detail-margin">
          <p className="detail"><strong>Calories: </strong>{entryDetails.calories.toLocaleString("en-us")}</p>
          <p className="detail"><strong>Fat: </strong>{entryDetails.fat} g</p>
          <p className="detail"><strong>Protein: </strong>{entryDetails.protein} g</p>
          <p className="detail"><strong>Carbs: </strong> {entryDetails.carbs} g</p>
        </div>
      </div>
    )
  }
  
  const fetchLogEntries = async (id) => {
    try {
      const log = await getLogEntries(id)
      log === 401 ? setShouldRedirect(true) : setLog(log)
    } catch (error) {
      console.error(error)
    }
  }

  const handlePost = async (id, formInput) => {
    try {
      const log = await postLogEntry(id, formInput)
      if (log.errors) {
        setErrors(log.errors)
      } else {
        const { entries, total, macros } = log
        setErrors([])
        setLog({
          ...log,
          entries,
          total,
          macros
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleDelete = async (entryId) => {
    try {
      const { entries, total, macros } = await deleteLogEntry(entryId)
      setLog({
        ...log,
        entries,
        total,
        macros
      })
    } catch (error) {
      console.error(error)
    }
  }

  const handlePatch = async (entryId, patchData) => {
    try {
      const {entries, total, macros } = await patchLogEntry(entryId, patchData)
      setLog({
        ...log,
        entries,
        total,
        macros
      })
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchLogEntries(id)
  }, [])

  const logEntriesList = log.entries.map((entry) => {
    return (
      <LogEntryTile 
        key={entry.entryId}
        entry={entry}
        handleDelete={handleDelete}
        handlePatch={handlePatch}
        showDetail={showDetail}
        setShowDetail={setShowDetail}
        setEntryDetails={setEntryDetails}
      />
    )
  })

  if (shouldRedirect) {
    location.href = "/logs"
  }
  
  return (
    <div className="grid-container">
      <div className="grid-x grid-margin-x align-center">
        <NaturalSearchForm 
          handlePost={handlePost}
          date={log.date}
          total={log.total}
          id={id}
          errorContainer={errorContainer}
        />
      </div>
      <div className="grid-x grid-margin-x align-center">
        <div className="table-container">
          <div className="table-wrapper table-scroll">
            {entryDetailDisplay}
            <table className="entry-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th></th>
                  <th>Qty</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {logEntriesList}
              </tbody>
            </table>
          </div>
        </div>
        <CalorieChart 
          user={props.user} 
          total={log.total} 
        />
      </div>
      <SummaryChart log={log} />
    </div>
  )
}

export default LogShowPage