import axios from 'axios';
import Cookies from 'js-cookie';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import className from 'classnames/bind';
import styles from './TrashProducts.module.scss';
import Image from '~/components/Image';

const cx = className.bind(styles);

function TrashProducts() {
    const navigate = useNavigate();
    const token = Cookies.get('tokenAdmin');
    const [products, setProducts] = useState([]);
    const [checkedItems, setCheckedItems] = useState([]);
    const [pageCount, setPageCount] = useState();
    const [currenPageProduct, setCurrenPageProduct] = useState();

    const postsPerPage = 8;

    const handleRestoreMultipleProduct = () => {
        var dataIds = checkedItems;
        const api = axios.create({
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        api.put(`${process.env.REACT_APP_BASE_URL}/Admin/restore-multiple-products`, dataIds )
            .then((res) => {
                getProducts(currenPageProduct || 1);
            })
            .catch((error) => {
                if (error.response.status === 401) navigate('/login');
            });
    };

    const handleRestoreProduct = (event) => {
        const id = event.target.dataset.id;
        const api = axios.create({
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        api.put(`${process.env.REACT_APP_BASE_URL}/Admin/restore-product/${id}`)
            .then((res) => {
                getProducts(currenPageProduct || 1);
            })
            .catch((error) => {
                if (error.response.status === 401) navigate('/login');
            });
    };

    useEffect(() => {
        const api = axios.create({
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        api.get(`${process.env.REACT_APP_BASE_URL}/Admin/trash-products?page=1&limit=${postsPerPage}`)
            .then((res) => {
                setProducts(res.data.products);
                setPageCount(res.data.countProduct);
            })
            .catch((error) => {
                if (error.response.status === 401) navigate('/login');
            });
    }, [token, navigate]);

    const handleChange = (event) => {
        const item = event.target.value;
        const isChecked = event.target.checked;
        // const targetElement = document.querySelector(`[data-product_id="${item}"]`);
        isChecked
            ? setCheckedItems([...checkedItems, Number(item)])
            : setCheckedItems(checkedItems.filter((i) => i !== Number(item)));
    };

    const handleCheckAll = (event) => {
        const arrItemChecked = document.querySelectorAll(`[name="checkProductItem"]`);
        if (event.target.checked) {
            const newListCart = [];
            products.forEach((item) => {
                newListCart.push(Number(item.productId));
            });
            arrItemChecked.forEach((item) => (item.checked = true));
            setCheckedItems(newListCart);
        } else {
            arrItemChecked.forEach((item) => (item.checked = false));
            setCheckedItems([]);
        }
    };

    const getProducts = (currenPage) => {
        const api = axios.create({
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        api.get(`${process.env.REACT_APP_BASE_URL}/Admin/trash-products?page=${currenPage}&limit=${postsPerPage}`)
            .then((res) => {
                setProducts(res.data.products);
                setPageCount(res.data.countProduct);
            })
            .catch((error) => {
                if (error.response.status === 401) navigate('/login');
            });
    };

    const handlePageClick = (event) => {
        let currenPage = event.selected + 1;
        getProducts(currenPage);
        setCurrenPageProduct(currenPage);
    };

    return (
        <div className={cx('container_m')}>
            <div className={cx('mt-4', 'mb-4', 'pd-top-20px')}>
                <div className={cx('action')}>
                    <div className={cx('action-container')}>
                        <div className={cx('actions-wrap')}>
                            <div className={cx('action-list')}>
                                <button
                                    className={cx('btn', 'btn--primary', 'mr-10')}
                                    onClick={handleRestoreMultipleProduct}
                                >
                                    Khôi phục
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={cx('table-wrap', 'mt-4')}>
                    <div className={cx('table-container')}>
                        <table className={cx('table')}>
                            <thead>
                                <tr>
                                    <td>
                                        <div className={cx('form-check')}>
                                            <input
                                                style={{ marginBottom: '4px' }}
                                                type="checkbox"
                                                onChange={handleCheckAll}
                                                className={cx('form-check-input')}
                                                id="checkbox-all"
                                                checked={checkedItems.length === products.length}
                                            />
                                        </div>
                                    </td>
                                    <th scope="col">Sản phẩm</th>
                                    <th scope="col" style={{ textAlign: 'center' }}>
                                        Giá
                                    </th>
                                    <th scope="col" style={{ textAlign: 'center' }}>
                                        Danh mục
                                    </th>

                                    <th scope="col" style={{ textAlign: 'center' }} colSpan="2">
                                        Hành động
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.length > 0 ? (
                                    products.map((result) => (
                                        <tr key={result.productId}>
                                            <td>
                                                <div className={cx('form-check')}>
                                                    <input
                                                        type="checkbox"
                                                        className={cx('form-check-input', 'check-input-product')}
                                                        value={result.productId}
                                                        name="checkProductItem"
                                                        onChange={handleChange}
                                                        checked={checkedItems.includes(result.productId)}
                                                    />
                                                </div>
                                            </td>
                                            <td>
                                                <Image style={{ width: '120px' }} src={result.image} alt="" />
                                                <p>{result.title}</p>
                                            </td>
                                            <td
                                                style={{ textAlign: 'center' }}
                                                data-price={result.productId}
                                                className={cx('unit-price')}
                                            >
                                                {result.price}$
                                            </td>
                                            <td style={{ textAlign: 'center' }}>{result.cate}</td>

                                            <td style={{ textAlign: 'center' }}>
                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                    <div
                                                        className={cx('btn-edit')}
                                                        data-id={result.productId}
                                                        onClick={handleRestoreProduct}
                                                    >
                                                        Khôi phục
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className={cx('text-center')}>
                                            Không có sản phẩm nào trong thùng rác của bạn.
                                            <Link to={'/products'}> Quay lại</Link>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {pageCount > 0 && (
                    <div className={styles['pagination-container']}>
                        <ReactPaginate
                            onPageChange={handlePageClick}
                            previousLabel={'<'}
                            breakLabel={'...'}
                            nextLabel={'>'}
                            pageCount={pageCount}
                            marginPagesDisplayed={3}
                            pageRangeDisplayed={3}
                            containerClassName={'paginationn'}
                            pageClassName={'page-itemm'}
                            pageLinkClassName={'page-linkk'}
                            previousClassName={'page-itemm'}
                            previousLinkClassName={'page-linkk'}
                            nextClassName={'page-itemm'}
                            nextLinkClassName={'page-linkk'}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default TrashProducts;
