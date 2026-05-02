package com.example.ordercontroller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.example.orderservice.OrderService;
import com.example.payload.ApiResponse;
import com.example.payload.OrderDTO;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/order")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
	public ResponseEntity<OrderDTO> createOrder(@RequestBody OrderDTO orderDto){
    	//orderDto.setOrderId(null);
		OrderDTO saveDto = orderService.createOrder(orderDto);
		return new ResponseEntity<OrderDTO>(saveDto, HttpStatus.CREATED);
		}

    @GetMapping
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        List<OrderDTO> orders = orderService.getAllOrders();
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    @DeleteMapping("/{orderId}")
    public ResponseEntity<ApiResponse> deleteOrder(@PathVariable("orderId") Integer orderId) {
        ApiResponse response = orderService.deleteOrder(orderId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{orderId}")
    public ResponseEntity<OrderDTO> updateOrder(@RequestBody OrderDTO orderDto, @PathVariable("orderId") Integer orderId) {
        OrderDTO updated = orderService.updateOrder(orderDto, orderId);
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderDTO> getOrder(@PathVariable("orderId") Integer orderId) {
        OrderDTO order = orderService.getOrder(orderId);
        return new ResponseEntity<>(order, HttpStatus.OK);
    }
}
