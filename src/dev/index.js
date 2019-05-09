import React, {useState, useMemo, useLayoutEffect, useRef} from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import startCase from 'lodash.startcase'
import useEventListener from '@use-it/event-listener'

import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import {makeStyles} from '@material-ui/core/styles'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'

import faker from 'faker'
import ReactWindowGrid from '../..'
import {db, locales} from './data'

const tests = [ // copied from ../_tests_/index.js
  [
    'Auto calculate height and width',
    {
      id: 'test1',
      height: 50,
      width: 100,
      columns: [
        {id: 'column1', label: 'Column 1'},
        {id: 'column2', label: 'Column 2'}
      ],
      recordset: [
        {column1: 'cell l/c 1/1', column2: 'cell 1/2'},
        {column1: 'cell 2/1', column2: 'cell 2/2'},
        {column1: 'cell 3/1', column2: 'cell 3/2'}
      ],
      rowHeaderWidth: 10
    }
  ]
]

const tables = Object.keys(db)

const TableSelect = props => {
  return (
    <FormControl fullWidth>
      <InputLabel htmlFor="table">Select table</InputLabel>
      <Select
        value={props.value}
        onChange={props.onChange}
        inputProps={{
          id: 'table'
        }}
      >
        {tables.map(table => {
          return (
            <MenuItem key={table} value={table}>
              {table}
            </MenuItem>
          )
        })}
      </Select>
    </FormControl>
  )
}

TableSelect.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}

const LocaleSelect = props => {
  return (
    <FormControl fullWidth>
      <InputLabel htmlFor="locale">Select locale</InputLabel>
      <Select
        value={props.value}
        onChange={props.onChange}
        inputProps={{
          id: 'locale'
        }}
      >
        {locales.map(locale => {
          return (
            <MenuItem key={locale} value={locale}>
              {locale}
            </MenuItem>
          )
        })}
      </Select>
    </FormControl>
  )
}

LocaleSelect.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}

const useStyles = makeStyles(theme => {
  return {
    root: {
      padding: theme.spacing(3)
    },
    grid: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      backgroundColor: theme.palette.background.default,
      border: '1px solid black'
    }
  }
})

const Demo = () => {
  const classes = useStyles()
  const [tableName, setTableName] = useState(tables[0])
  const [locale, setLocale] = useState('en')
  const [numberOfRows, setNumberOfRows] = useState(100)
  const [columns, recordset] = useMemo(() => {
    console.log(`generating ${numberOfRows} records`, tableName)
    faker.locale = locale
    const columns = []
    for (const columnName of db[tableName]) {
      columns.push({
        id: columnName,
        label: startCase(columnName)
      })
    }
    const recordset = []
    for (let rowIndex = 0; rowIndex < numberOfRows; rowIndex++) {
      const record = {}
      for (const columnName of db[tableName]) {
        record[columnName] = faker.fake(`{{${tableName}.${columnName}}}`)
      }
      recordset.push(record)
    }
    return [columns, recordset]
  }, [tableName, numberOfRows, locale])
  const panel = useRef(null)
  const [panelWidth, setPanelWidth] = useState(0)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => {
    if (panel.current.offsetWidth !== panelWidth) {
      setPanelWidth(panel.current.offsetWidth)
    }
  })
  const [rowHeaderWidth, setRowHeaderWidth] = useState(50)
  const [fontSize, setFontSize] = useState(16)
  useEventListener('resize', () => setPanelWidth(0))
  return (
    <Paper className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" align="center">
            ReactWindowGrid demo
          </Typography>
        </Grid>
        <Grid item xs={4} sm={2}>
          <LocaleSelect
            value={locale}
            onChange={event => setLocale(event.target.value)}
          />
        </Grid>
        <Grid item xs={5} sm={3}>
          <TableSelect
            value={tableName}
            onChange={event => setTableName(event.target.value)}
          />
        </Grid>
        <Grid item xs={3} sm={1}>
          <TextField
            label="Rows"
            type="number"
            value={numberOfRows}
            onChange={event => setNumberOfRows(Number(event.target.value))}
          />
        </Grid>
        <Grid item xs={4} sm={3}>
          <TextField
            label="Row header width"
            type="number"
            value={rowHeaderWidth}
            onChange={event => setRowHeaderWidth(Number(event.target.value))}
          />
        </Grid>
        <Grid item xs={3} sm={2}>
          <TextField
            label="Font size"
            type="number"
            value={fontSize}
            onChange={event => setFontSize(Number(event.target.value))}
          />
        </Grid>
        <Grid item xs={12} ref={panel}>
          <ReactWindowGrid
            style={{
              fontSize
            }}
            className={classes.grid}
            height={400}
            width={panelWidth}
            columns={columns}
            recordset={recordset}
            rowHeaderWidth={rowHeaderWidth}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" align="center">
            ReactWindowGrid tests
          </Typography>
        </Grid>
        {tests.map(([name, props]) => {
          return (
            <Grid key={name} item xs={12} sm={4}>
              <Typography variant="headline">{name}</Typography>
              <ReactWindowGrid style={{marginTop: 8}} {...props} />
            </Grid>
          )
        })}
      </Grid>
    </Paper>
  )
}

ReactDOM.render(<Demo />, document.getElementById('app'))

module.hot.accept()
