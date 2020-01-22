import React from 'react'
import axios from '../commons/axios'
import {CSSTransition, TransitionGroup} from 'react-transition-group'
import ToolBox from '../components/ToolBox'
import Product from '../components/productss'
import Panel from '../components/Panel'
import AddInventory from '../components/AddInventory'

class Products extends React.Component {

    state = {
    products: [],
    sourceProduct: [],
    cartNum: 0
    }

    componentDidMount() {
        axios.get('/products').then(response => {
            this.setState({
                products: response.data,
                sourceProduct: response.data
            });
        });
        this.updateCartNum();
    };

    // search
    search = text => {
        // 1. Get New Array
        let _products = [...this.state.sourceProduct] // 必須為完整的數據 要不然刪除石會找不到

        // 2. Filters New Array
        _products = _products.filter(p => {
            // name: Abcd text: ab ===> ['Ab']
            // text: '' ===> ['', '','','','']
            const matchArray = p.name.match(new RegExp(text, 'gi')) // 'i'表示不影響大小寫
            return !!matchArray
        });

        // 3. Set State
        this.setState({
            products: _products
        })
    };

    toAdd = () => {
        Panel.open({
            component: AddInventory,
            callback: data => {
                if (data) {
                    this.add(data)
                }
            }
        });
    };

    add = product => {
        const _products = [...this.state.products]
        _products.push(product)
        const _sproducts = [...this.state.sourceProduct]
        _sproducts.push(product)

        this.setState({
            products: _products,
            sourceProduct: _sproducts
        })
    }

    update = product => {
        const _products = [...this.state.products]
        const _index = _products.findIndex(p => p.id === product.id)
        _products.splice(_index, 1, product)
        const _sproducts = [...this.state.sourceProduct]
        const _sindex = _products.findIndex(p => p.id === product.id)
        _sproducts.splice(_sindex, 1, product)

        this.setState({
            products: _products,
            sourceProduct: _sproducts
        });
    };

    delete = id => {
        const _products = this.state.products.filter(p => p.id !== id)
        const _sproducts = this.state.sourceProduct.filter(p => p.id !== id)

        this.setState({
            products: _products,
            sourceProduct: _sproducts
        });
    }

    updateCartNum = async () => {
        const cartNum = await this.initCartNum();
        this.setState({
            cartNum: cartNum
        })
    };

    initCartNum = async () => {
        const user = global.auth.getUser() || []
        const res = await axios.get('/carts', {
            params: {
                userId: user.email
            }
        })
        const carts = res.data || []
        const cartNum = carts
            .map(cart => cart.mount) // [1, 1, 1]
            .reduce((a, value) => a + value, 0) // a為累加 value為當前值
        return cartNum;
    }

    render() {
        return (
            <div>
                <ToolBox search={this.search} cartNum={this.state.cartNum}/>
                <div className='products'>
                    <div className='columns is-multiline is-desktop'>
                        <TransitionGroup component={null}> 
                        {this.state.products.map(p => { 
                            return ( // key要注意是否有加 使一組數據能呈現動態效果
                                <CSSTransition classNames="product-fade" timeout={300} key={p.id}>
                                    <div className='column is-3' key={p.id}>
                                        <Product product={p} update={this.update} delete={this.delete} updateCartNum={this.updateCartNum}/>
                                    </div>
                                </CSSTransition>
                            );
                        })}
                        </TransitionGroup>
                        {
                            (global.auth.getUser() || {}).type === 1 && (
                                <button className='button is-primary add-btn' onClick={this.toAdd}>add</button>
                            )
                        }
        
                        {/*
                        <div className='column is-3'>
                            <Product />
                        </div>
                        <div className='column is-3'>
                            <Product />
                        </div>
                        <div className='column is-3'>
                            <Product />
                        </div>
                        */}
                    </div>
                </div>
            </div>
        )
    }
}

export default Products;