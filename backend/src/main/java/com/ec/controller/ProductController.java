package com.ec.controller;

import com.ec.entity.Product;
import com.ec.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
@Tag(name = "Products", description = "Product management APIs")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ProductController  {

    private final ProductService productService;

    @GetMapping
    @Operation(summary = "Get all products", description = "Returns a list of all available products")
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }
} 