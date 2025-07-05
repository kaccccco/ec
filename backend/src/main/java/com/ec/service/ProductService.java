package com.ec.service;

import com.ec.entity.Product;
import com.ec.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final RedisService redisService;

    public void initializeProducts() {
        if (productRepository.count() == 0) {
            List<Product> initialProducts = List.of(
                Product.builder().name("iPhone 15").price(new BigDecimal("7999.00")).stock(100).build(),
                Product.builder().name("MacBook Pro").price(new BigDecimal("12999.00")).stock(50).build(),
                Product.builder().name("AirPods Pro").price(new BigDecimal("1999.00")).stock(200).build(),
                Product.builder().name("iPad Air").price(new BigDecimal("4399.00")).stock(75).build(),
                Product.builder().name("Apple Watch").price(new BigDecimal("2999.00")).stock(150).build()
            );
            
            initialProducts.stream()
                .map(productRepository::save)
                .forEach(product -> {
                    redisService.setProduct(product.getId(), product);
                    redisService.setProductStock(product.getId(), product.getStock());
                });
            
            log.info("Initialized {} products", initialProducts.size());
        }
    }

    public List<Product> getAllProducts() {
        List<Product> products = productRepository.findAll();
        redisService.setAllProducts(products);
        return products;
    }

    @Cacheable(value = "products", key = "#id")
    public Optional<Product> getProductById(Long id) {
        return Optional.ofNullable(redisService.getProduct(id, Product.class))
            .or(() -> {
                Optional<Product> product = productRepository.findById(id);
                product.ifPresent(p -> redisService.setProduct(id, p));
                return product;
            });
    }


    @CacheEvict(value = {"products"}, allEntries = true)
    public boolean updateStock(Long productId, Integer quantity) {
        return Optional.ofNullable(redisService.deductStock(productId, quantity))
            .map(result -> {
                if (result == -1) throw new RuntimeException("Product not found");
                if (result == -2) throw new RuntimeException("Insufficient stock");
                
                productRepository.findById(productId)
                    .ifPresent(product -> {
                        product.updateStock(result.intValue());
                        productRepository.save(product);
                        redisService.setProduct(productId, product);
                        redisService.delete("products:all");
                    });
                
                return true;
            })
            .orElse(false);
    }

    @CacheEvict(value = {"products"}, allEntries = true)
    public void rollbackStock(Long productId, Integer quantity) {
        Optional.ofNullable(redisService.rollbackStock(productId, quantity))
            .ifPresent(result -> {
                productRepository.findById(productId)
                    .ifPresent(product -> {
                        product.updateStock(result.intValue());
                        productRepository.save(product);
                        redisService.setProduct(productId, product);
                        redisService.delete("products:all");
                    });
            });
    }
} 