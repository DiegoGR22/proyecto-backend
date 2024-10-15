import Product from "../DAO/product.dao.js";

const productService = new Product();

export const getProducts = async (req, res) => {
    const { page = 1, limit = 10, cat = "", status = "", sort = "desc" } = req.query;

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        lean: true
    }

    try {
        const result = await productService.getProducts({ page, limit, cat, status, sort });

        // Crear los enlaces para la página anterior y siguiente
        const prevLink = result.hasPrevPage ? `/products?page=${result.prevPage}&limit=${limit}&query=${query}&sort=${sort}` : null;
        const nextLink = result.hasNextPage ? `/products?page=${result.nextPage}&limit=${limit}&query=${query}&sort=${sort}` : null;

        // Estructura del objeto de respuesta
        const response = {
            status: "success",
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: prevLink,
            nextLink: nextLink
        };

        res.status(200).json(response);

    } catch (error) {
        res.status(500).json({ message: "Error fetching products " })
    }
}

export const createProduct = async (req, res) => {
    const product = req.body;

    try {
        const result = await productService.createProduct(product);;
        res.status(201).json({ message: "Product created", payload: result });
    } catch (error) {
        res.status(500).json({ message: "Product not created!" });
    }
}

export const createManyProducts = async (req, res) => {
    const products = req.body;

    if (!Array.isArray(products)) {
        return res.status(400).json({ message: "Input data should be an array" })
    }

    try {
        const result = await productService.createManyProductt(products);
        res.status(201).json({ message: "Product created", payload: result });
    } catch (error) {
        res.status(500).json({ message: "Product not created!" });
    }
}

export const getProductById = async (req, res) => {
    const { pid } = req.params

    try {
        const product = await productService.findProduct(pid);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        return res.status(200).json({ message: 'Product found!', product });
    }
    catch (err) {
        return res.status(500).json({ message: 'Error fetching product' });
    }
}

export const updateProduct = async (req, res) => {
    const { pid } = req.params
    const updatedProduct = req.body

    try {
        const product = await productService.updateProduct(pid, updatedProduct)
        
        if (product === null) {
            res.status(404).json({ message: 'Product not found' });
        } else {
            res.status(200).json({ message: 'Product updated!', product });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product' });
    }
}

export const deleteProduct = async (req, res) => {
    const { pid } = req.params

    try {
        const product = await productService.deleteProduct(pid);

        if (product === null) {
            res.status(404).json({ message: 'Product not found' });
        } else {
            res.status(200).json({ message: 'Producto deleted!', product });
        }
    } catch (error) {
        // Manejo de errores generales
        console.error(error);
        res.status(500).json({ message: 'Error fetching product' });
    }
}