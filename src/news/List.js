import React, { useEffect, useState } from "react";
import AxiosInstance from '../helper/AsioxInstance';
import swal from 'sweetalert';

const List = (props) => {

    const { user, saveUser } = props;
    const [news, setNews] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const result = await AxiosInstance().get("/get-news.php");
            setNews(result);
            console.log(result)
        }
        fetchData();
    }, []);

    const hanleDelete = async (id) => {
        swal({
            title: "Xác nhận xóa",
            text: "Xóa dữ liệu khỏi hệ thống",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then(async (willDelete) => {
                if (willDelete) {
                    try {
                        console.log(id)
                        const result = await AxiosInstance().delete(`delete-news.php?id=` + id);
                        console.log(result);
                        if (result.status) {
                            swal("Xóa thành công");
                            const newNews = news.filter(item => item.id != id);
                            setNews(newNews);
                        }
                        else {
                            swal('Xóa thất bại')
                        }
                    } catch (error) {
                        console.log(error)
                    }
                }
            });
    }

    return (
        <div>
            <h1>Doanh sách tin tức</h1>
            <button className="btn btn-primary" onClick={() => saveUser(null)}>
                Đăng xuất
            </button>
            <a className="btn btn-success" href="/add"> Thêm mới</a>
            <table className="table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Content</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        news.map((item, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.title}</td>
                                <td>{item.content}</td>
                                <td>
                                    <a href={`/edit/${item.id}`} className="btn btn-primary">Sửa</a>
                                    <button onClick={() => hanleDelete(item.id)} className="btn btn-danger">Xóa</button>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default List;