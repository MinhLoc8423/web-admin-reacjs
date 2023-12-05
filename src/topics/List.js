import React, { useEffect, useState } from "react";
import AxiosInstance from '../helper/AsioxInstance';
import swal from 'sweetalert';

const List = (props) => {

    const { user, saveUser } = props;
    const [news, setNews] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const result = await AxiosInstance().get("/get-topics.php");
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
                        const result = await AxiosInstance().delete(`delete-topics.php?id=` + id);
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
            <h1>Doanh sách đề tài</h1>
            <button className="btn btn-primary" onClick={() => saveUser(null)}>
                Đăng xuất
            </button>
            <a className="btn btn-success" href="/addtopic"> Thêm mới</a>
            <table className="table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        news.map((item, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.name}</td>
                                <td>{item.description}</td>
                                <td>
                                    <a href={`/edittopic/${item.id}`} className="btn btn-primary">Sửa</a>
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