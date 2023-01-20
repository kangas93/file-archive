import './App.css';
import { data } from './utils/dummyData';
import { fetchFileList, uploadFile } from './utils/requests';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { ChangeEvent, useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';


const columns: GridColDef[] = [
  { field: 'id', headerName: 'File', width: 70 },
  { field: 'author', headerName: 'Author', width: 130 },
  { field: 'description', headerName: 'Description', width: 130 },
  { field: 'date', headerName: 'Date', width: 130 },
];

function App() {

  const [fileList, setFileList] = useState(null)
  const [fileToUpload, setFileToUpload] = useState<File | null>();
  const [updateList, setUpdateList] = useState(true)


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
      setFileToUpload(e.target.files[0]);
    }
  }
  const onUploadFileClick = async () => {
    if (fileToUpload) {
      const data = new FormData();
      data.append('file', fileToUpload);
      const author = document.getElementById("author") as HTMLInputElement;
      const description = document.getElementById("author") as HTMLInputElement;
      data.append('author', author.value)
      data.append('description', description.value)
      const uploaded = await uploadFile(data)
      if (uploaded) {
        //setFileToUpload(undefined);
        let file = document.getElementById("file") as HTMLInputElement;
        file.value = file.defaultValue
        setFileToUpload(null)
        setUpdateList(true);
        console.log("DONE")
      }
    }
  }

  return (
    <div className="App">
      <div style={{ height: 400, width: '100%' }}>
        {fileList!! ?
          <DataGrid
            rows={fileList}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
          /> : <CircularProgress />}
      </div>
      <form>
        <input type="file" id="file" name="file" onChange={onFileChange} />
        <input type="text" id="author" name="author" placeholder='Author' />
        <input type="text" id="description" name="description" placeholder='Description' />
        {fileToUpload!! ? <button type="button" onClick={onUploadFileClick}> UPLOAD</button> : null}
      </form>

    </div>
  );
}

export default App;
