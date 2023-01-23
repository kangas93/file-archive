import './App.css';
import jpgIcon from './assets/JPG_file_icon.svg'
import pdfIcon from './assets/PDF_file_icon.svg'
import xmlIcon from './assets/XML_file_icon2.svg'
import { fetchFileList, uploadFile, downloadFile, deleteFile } from './utils/requests';
import { DataGrid, GridCallbackDetails, GridCellParams, GridColDef, MuiEvent } from '@mui/x-data-grid';
import { ChangeEvent, useEffect, useState } from 'react';
import { CircularProgress, Button, TextField } from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import download from 'downloadjs'

enum FileTypes {
  Jpeg = 'jpeg',
  Jpg = 'jpg',
  Xml = 'xml',
  Pdf = 'pdf'
}

const styles = {
  deleteCellContainer: {
    display: 'flex', justifyContent: 'flex-start', width: '-webkit-fill-available', cursor: 'pointer',
  },
  fileIcon: {
    height: '35px'
  },
  fileInput: {
    padding: '20px',
    background: 'gray',
    cursor: 'pointer',
  },
  inputError: {
    background: 'red',
    color: 'white',
  },
  fileUploadContainer: { display: 'flex', justifyContent: 'flex-start', alignItems: 'center', margin: '30px 0px 30px 0px' },
  textInput: {
    marginRight: '20px'
  },
  dataGridContainer: {
    height: '400px',
    witdh: '100%',
    padding: '30px',
  }



}

const getIcon = (fileType: string) => {
  switch (fileType) {
    case 'jpeg':
      return jpgIcon;
    case 'jpg':
      return jpgIcon;
    case 'xml':
      return xmlIcon;
    case 'pdf':
      return pdfIcon;
    default:
      return ""
  }
}


const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 140 },
  {
    field: 'fileType', headerName: '', width: 70, renderCell: (params) => {
      return (<img alt="Filetype" style={styles.fileIcon} src={getIcon(params.value)} />)
    }
  },
  { field: 'name', headerName: 'File', flex: 0.5 },
  { field: 'author', headerName: 'Author', width: 130 },
  { field: 'description', headerName: 'Description', flex: 1 },
  { field: 'date', headerName: 'Date', width: 130 },
  {
    field: 'delete', headerName: 'Delete', flex: 1, renderCell: () => {
      return (<div style={styles.deleteCellContainer} > <HighlightOffIcon className='delete-icon'></HighlightOffIcon></ div>)
    }
  },
];

const columnVisibilityModel = {
  id: false,
}

function App() {

  const [fileList, setFileList] = useState(null)
  const [fileToUpload, setFileToUpload] = useState<File | null>();
  const [updateList, setUpdateList] = useState(true);
  const [showFileErrorMessage, setShowFileErrorMessage] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");


  useEffect(() => {
    if (updateList) {
      const getFiles = async () => {
        const data = await fetchFileList()
        setFileList(data)
      }

      getFiles();
      setUpdateList(false);

    }
  }, [updateList])

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFileName(e.target.files[0].name)
      const filetype = e.target.files[0].type.split('/')[1];

      if (filetype === FileTypes.Pdf || filetype === FileTypes.Jpeg || filetype === FileTypes.Jpg || filetype === FileTypes.Xml) {

        setFileToUpload(e.target.files[0]);
        setShowFileErrorMessage(false);
      }
      else {
        setFileToUpload(null);
        setShowFileErrorMessage(true);
      }


    }
  }
  const onUploadFileClick = async () => {
    if (fileToUpload) {
      const data = new FormData();
      data.append('file', fileToUpload);
      data.append('fileType', fileToUpload.type.split('/')[1])
      let author = document.getElementById("author") as HTMLInputElement;
      let description = document.getElementById("description") as HTMLInputElement;
      let newName = document.getElementById("newName") as HTMLInputElement;
      data.append('author', author.value)
      data.append('description', description.value)
      if (newName.value !== newName.defaultValue) data.append('newName', newName.value)
      const uploaded = await uploadFile(data)
      if (uploaded) {
        let file = document.getElementById("file") as HTMLInputElement;
        file.value = file.defaultValue
        author.value = author.defaultValue
        description.value = description.defaultValue
        newName.value = newName.defaultValue;
        setFileToUpload(null)
        setUpdateList(true);
        setSelectedFileName("")
      }
    }
  }

  const onCellClick = (params: GridCellParams, event: MuiEvent<React.MouseEvent>, details: GridCallbackDetails) => {
    if (params.field === "name") {
      const getFile = async () => {
        const file = await downloadFile(params.id.toString())
        if (file) {
          download(file, params.row.name);
        }
      }
      getFile();
    }
    else if (params.field === "delete") {

      const sendDeleteRequest = async () => {
        const isDeleted = await deleteFile(params.id.toString())
        if (isDeleted) {
          setUpdateList(true);
        }
      }
      sendDeleteRequest();

    }


  }


  return (
    <div className="App">
      <div style={styles.dataGridContainer}>
        {fileList!! ?
          <DataGrid
            columnVisibilityModel={columnVisibilityModel}
            disableColumnMenu
            onCellClick={onCellClick}
            rows={fileList}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
          /> : <CircularProgress />}
      </div>
      <form style={{ padding: '30px' }}>
        <div style={styles.fileUploadContainer}>
          <div style={{ display: 'flex', flexDirection: 'column', marginRight: '30px' }}>
            {showFileErrorMessage ? <p style={{ color: 'red' }}> Valid formats are pdf, jpeg and xml</p> : null}
            <label style={showFileErrorMessage ? { ...styles.fileInput, ...styles.inputError } : styles.fileInput} className="file-input">
              <input style={{ display: 'none' }} type="file" id="file" name="file" onChange={onFileChange} />
              Select file
            </label>
          </div>
          <p style={{
            maxWidth: '100px',
            wordBreak: 'break-word'
          }}>{selectedFileName}</p>
        </div>
        {fileToUpload!! ?
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <TextField style={styles.textInput} variant="filled" id="author" name="author" label="Author" placeholder='John Doe' />
            <TextField style={styles.textInput} variant="filled" id="description" label="Description" name="description" placeholder='A cool file' />
            <TextField style={styles.textInput} variant="filled" id="newName" label="New file name" name="newName" placeholder='New name' />
            <Button style={{ maxWidth: '100px' }} type="button" variant="contained" color='primary' onClick={onUploadFileClick}> UPLOAD</Button> </div> : null}
      </form>

    </div>
  );
}

export default App;
