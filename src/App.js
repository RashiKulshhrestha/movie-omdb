import React, { useEffect, useState } from 'react';
import { 
    Layout, 
    Input, 
    Row, 
    Col, 
    Card, 
    Tag, 
    Spin,
    Select,
    Button,
    Alert, 
    Modal, 
    Typography 
} from 'antd';
import 'antd/dist/antd.css';
import './App.css';

const API_KEY = 'a81ac4ea';
const { Header, Content, Footer } = Layout;
const { Search } = Input;
const { Meta } = Card;
const TextTitle = Typography.Title;
const { Option } = Select;

const favourite = [];

const SearchBox = ({searchHandler}) => {
    return (
        <Row>
            <Col span={12} offset={6}>
                <Search
                    placeholder="enter movie, series, episode name"
                    enterButton="Search"
                    size="large"
                    onSearch={value => searchHandler(value)}
                />
            </Col>
        </Row>
    )
}

const ColCardBox = ({Title, imdbID, Poster, Type, ShowDetail, DetailRequest, ActivateModal1 }) => {
    const [favouriteText,setFavouriteText] = useState("Add to Favourites");
    const [disabled, setDisable] = useState(false);

    const clickHandler = () => {

        // Display Modal and Loading Icon
        ActivateModal1(true);
        DetailRequest(true);

        fetch(`http://www.omdbapi.com/?i=${imdbID}&apikey=${API_KEY}`)
        .then(resp => resp)
        .then(resp => resp.json())
        .then(response => {
            DetailRequest(false);
            ShowDetail(response);
        })
        .catch(({message}) => {
            DetailRequest(false);
        })
    }

    const addToFavourite = () => {
        setFavouriteText("Unfavourite");
        setDisable("true");
        favourite.push({Title, Poster, Type});
        console.log(favourite);
    }

    return (
        <Col className="gutter-row" span={4}>
            <div className="gutter-box">
                <Card
                    cover={
                        <img
                            alt={Title}
                            src={Poster === 'N/A' ? 'http://placehold.it/198x264&text=Image+Not+Found' : Poster}
                            onClick={() => clickHandler()}
                            
                        />
                    }
                   
                >
                    <Meta
                            title={Title}
                            description={false}
                    />
                    <Row className="gutter-row">
                        <Col>
                            <Tag color="magenta">{Type}</Tag>
                        </Col>
                        <Col>
                          <i className="fa fa-thumb-tack" aria-hidden="true"></i>
                        </Col>
                    </Row>
                    <Button className="add-button"
                        type="primary"
                        disabled={disabled}
                        icon={<i className="fa fa-heart-o" aria-hidden="true"></i>}
                        onClick={addToFavourite}
                        {...Title}{...Type}{...Poster}
                        key={imdbID}>
                            {favouriteText}
                    </Button>
                    
                </Card>
            </div>
        </Col>
    )
}

const FavouriteMovies = () => {
    
    console.log(favourite);
    return(
        <div>
            {favourite.map((item) =>(
            <Col className="gutter-row" span={4}>
            <div className="gutter-box">
                <Card
                    style={{ width: 200 }}
                    cover={
                        <img
                            alt={item.Title}
                            src={item.Poster === 'N/A' ? 'http://placehold.it/198x264&text=Image+Not+Found' : item.Poster}
                        />
                    }
                >
                    <Meta
                            title={item.Title}
                     />
                    <Row className="gutter-row">
                        <Col>
                            <Tag color="magenta">{item.Type}</Tag>
                        </Col>
                    </Row>
                </Card>
            </div>
        </Col>
        ))},
        </div>
    )
};

const MovieDetail = ({Title, Poster, imdbRating, Rated, Runtime, Genre, Plot}) => {
    return (
        <Row>
            <Col span={11} >
                <img 
                    src={Poster === 'N/A' ? 'http://placehold.it/198x264&text=Image+Not+Found' : Poster} 
                    alt={Title} 
                />
            </Col>
            <Col span={13}>
                <Row>
                    <Col span={21}>
                        <TextTitle level={4}>{Title}</TextTitle></Col>
                    <Col span={3} >
                        <TextTitle level={4}><span style={{color: '#41A8F8'}}>{imdbRating}</span></TextTitle>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Tag>{Rated}</Tag> 
                        <Tag>{Runtime}</Tag> 
                        <Tag>{Genre}</Tag>
                    </Col>
                </Row>
                <Row>
                    <Col>{Plot}</Col>
                </Row>
            </Col>
        </Row>
    )
}

const Loader = () => (
    <div className="spin">
        <Spin />
    </div>
)

function App() {

    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [q, setQuery] = useState('batman');
    const [filter,setFilter] = useState('');
    const [activateModal1, setActivateModal1] = useState(false);
    const [activateModal2, setActivateModal2] = useState(false);
    const [detail, setShowDetail] = useState(false);
    const [detailRequest, setDetailRequest] = useState(false);
    
    
    useEffect(() => {

        setLoading(true);
        setError(null);
        setData(null);
        console.log(filter);
        fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&&s=${q}&&type=${filter}`)
        .then(resp => resp)
        .then(resp => resp.json())
        .then(response => {
            if (response.Response === 'False') {
                setError(response.Error);
            }
            else {
                setData(response.Search);
            }

            setLoading(false);
        })
        .catch(({message}) => {
            setError(message);
            setLoading(false);
        })

    }, [q,filter]);

    

    return (
        <div className="App">
            <Layout className="layout">
                <Header>
                    <div>
                        <TextTitle className="header-omdb" level={3}>OMDB MOVIES
                        <Button
                        ShowDetail={setShowDetail} 
                        DetailRequest={setDetailRequest}
                        ActivateModal2={setActivateModal2} onClick={() => setActivateModal2(true)}
                        >Favourites
                    </Button>
                    </TextTitle>
                        
                    </div>
                    
                </Header>
                <Content>
                    <div>
                    <div className="search-bar">
                    
                    <SearchBox searchHandler={setQuery} />
                    <Select defaultValue="all" className="type-input" onChange={setFilter}>
                        <Option value="">All</Option>
                        <Option value="movie">Movies</Option>
                        <Option value="series">Series</Option>
                        <Option value="episodes">Episodes</Option>
                    </Select>
                    </div>
                        
                        <Row gutter={16} type="flex" justify="center">
                            { loading &&
                                <Loader />
                            }

                            { error !== null &&
                                <div className="danger-alert">
                                    <Alert message={error} type="error" />
                                </div>
                            }
                            
                            { data !== null && data.length > 0 && data.map((result, index) => (
                                <ColCardBox 
                                    ShowDetail={setShowDetail} 
                                    DetailRequest={setDetailRequest}
                                    ActivateModal1={setActivateModal1}
                                    key={index} 
                                    {...result} 
                                />
                            ))}
                        </Row>
                    </div>
                    <Modal
                        title='Detail'
                        centered
                        visible={activateModal1}
                        onCancel={() => setActivateModal1(false)}
                        footer={null}
                        width={800}
                        >
                        { detailRequest === false ?
                            (<MovieDetail {...detail} />) :
                            (<Loader />) 
                        }
                    </Modal>
                    <Modal
                        title='Favourites'
                        centered
                        visible={activateModal2}
                        onCancel={() => setActivateModal2(false)}
                        footer={null}
                        width={800}
                        >
                        { detailRequest === false ?
                            (<FavouriteMovies {...detail} />) :
                            (<Loader />) 
                        }
                    </Modal>
                </Content>
                <Footer className="center">OMDB Movies ©2020</Footer>
            </Layout>
        </div>
    );
}

export default App;