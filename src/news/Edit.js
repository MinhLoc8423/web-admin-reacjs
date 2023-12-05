import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import AxiosInstance from "../helper/AsioxInstance";
import swal from 'sweetalert';

const Edit = (props) => {
    const { id } = useParams();
    const { user } = props;

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState("");
    const [topic_id, setTopic_id] = useState(1);
    const [user_id, setUser_id] = useState(user?.ID);

    const [imageInput, setImageInput] = useState("")
    const [imagePerview, setImagePreView] = useState("")

    const handleImageChange = async (e) => {
        // hiện thị hình ảnh
        const file = e.target.files[0];
        if (!file) return;
        setImagePreView(URL.createObjectURL(file));
        // upload file
        const formData = new FormData();
        formData.append('image', file);
        const result = await AxiosInstance('multipart/form-data')
            .post("/upload-file.php", formData);
        console.log(result);
        setImage(result.path);
    }

    // doanh sách chủ đề 
    const [topics, setTopics] = useState([])
    useEffect(() => {
        const fetchTopics = async () => {
            const result = await AxiosInstance().get('/get-topics.php');
            setTopics(result);
        }
        fetchTopics();
    }, []);

    useEffect(() => {
        const fetchNews = async () => {
            const result = await AxiosInstance().get('/get-news-detail.php?id=' + id);
            console.log(result);
            setTitle(result.title);
            setContent(result.content);
            setImage(result.image || "");
            setImagePreView(result.image || "")
            setTopic_id(result.topic_id);
            setUser_id(result.user_id)
        }
        fetchNews();
    }, [id])

    const handleEdit = async () => {
        swal({
            title: "Vui lòng xác nhận sửa",
            text: "Sửa dữ liệu vào hệ thông!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then(async (will) => {
                if (will) {
                    try {
                        if (!title || !content || !image) {
                            swal("Vui lòng nhập đầy đủ thông tin");
                            return;
                        }

                        const body = {
                            title: title,
                            content: content,
                            image: image,
                            user_id: user_id,
                            topic_id: topic_id
                        }
                        console.log(body)
                        const result = await AxiosInstance().put("/update-news.php?id=" + id, body);
                        console.log(result)
                        swal("Sửa thành công")
                        window.location.href = '/'
                    } catch (error) {
                        console.log(error)
                    }
                }
            });
    }

    return (
        // <div>
        //     <h1>Edit</h1>
        //     <form>
        //         <input type="text" value={title} onChange={(e)=> setTitle(e.target.value)} />
        //         <br />
        //         <input type="text" value={content} onChange={(e)=> setContent(e.target.value)} />
        //         <br />
        //         <input type="file" value={imageInput} onChange={handleImageChange} />
        //         <br />
        //         <img src={imagePerview} alt="" width={200} height={200} />
        //         <br />
        //         <select value={topic_id} onChange={(e)=> setTopic_id(e.target.value)}>
        //             {
        //                 topics.map((item, index) => (
        //                     <option value={item.id} key={index}>{item.name}</option>
        //                 ))
        //             }
        //         </select>
        //         <br />
        //         <button type="button" onClick={handleEdit}>Sửa</button>
        //     </form>
        // </div>
        <div className="container mt-5">
            <h1>Chỉnh sửa tin tức</h1>
            <form>
                {/* Ô input văn bản */}
                <div className="mb-3">
                    <label htmlFor="exampleText" className="form-label">Tiêu đề</label>
                    <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} id="exampleText" />
                </div>

                {/* Ô input email */}
                <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">Nội dung</label>
                    <input type="text" className="form-control" value={content} onChange={(e) => setContent(e.target.value)} />
                </div>

                {/* Ô input password */}
                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">Mật khẩu</label>
                    <input type="file" className="form-control" value={imageInput} onChange={handleImageChange} />
                </div>

                <img src={imagePerview} alt="" width={250} height={250} />
                 <br />
                 <br />
                 <select class="form-select" value={topic_id} onChange={(e)=> setTopic_id(e.target.value)}>
                     {
                         topics.map((item, index) => (
                             <option value={item.id} key={index}>{item.name}</option>
                         ))
                     }
                 </select>

                {/* Nút Submit */}
                <br/>
                <button type="button" class="btn btn-success btn-block"  onClick={handleEdit}>Sửa</button>
            </form>
        </div>
    )
}

export default Edit;