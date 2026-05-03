package com.example.orderservice;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.model.Order;
import com.example.orderrepository.OrderRepository;
import com.example.payload.ApiResponse;
import com.example.payload.OrderDTO;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderrepo;

    private OrderDTO entityToDto(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setOrderId(order.getOrderId());
        dto.setExternalOrderId(order.getExternalOrderId());
        dto.setProductName(order.getProductName());
        dto.setQuantity(order.getQuantity());
        dto.setCustomerName(order.getCustomerName());
        dto.setCustomerEmail(order.getCustomerEmail());
        dto.setCustomerPhone(order.getCustomerPhone());
        dto.setShippingAddress(order.getShippingAddress());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setStatus(order.getStatus());
        dto.setPlatform(order.getPlatform());
        dto.setOrderDate(order.getOrderDate());
        return dto;
    }

    private Order dtoToEntity(OrderDTO dto) {
        Order order = new Order();
        order.setExternalOrderId(dto.getExternalOrderId());
        order.setProductName(dto.getProductName());
        order.setQuantity(dto.getQuantity());
        order.setCustomerName(dto.getCustomerName());
        order.setCustomerEmail(dto.getCustomerEmail());
        order.setCustomerPhone(dto.getCustomerPhone());
        order.setShippingAddress(dto.getShippingAddress());
        order.setTotalAmount(dto.getTotalAmount());
        order.setStatus(dto.getStatus());
        order.setPlatform(dto.getPlatform());
        order.setOrderDate(dto.getOrderDate());
        return order;
    }

    public OrderDTO createOrder(OrderDTO dto) {
        Order order = dtoToEntity(dto);
        Order savedOrder = orderrepo.save(order);
        return entityToDto(savedOrder);
    }

    public List<OrderDTO> getAllOrders() {
        return orderrepo.findAll()
                .stream()
                .map(this::entityToDto)
                .collect(Collectors.toList());
    }

    public ApiResponse deleteOrder(Long orderId) {
        Optional<Order> order = orderrepo.findById(orderId);
        if (order.isPresent()) {
            orderrepo.delete(order.get());
        }
        ApiResponse response = new ApiResponse();
        response.setMessage("Order deleted successfully");
        return response;
    }

    public OrderDTO updateOrder(OrderDTO orderDto, Long orderId) {
        Optional<Order> optOrder = orderrepo.findById(orderId);
        if (optOrder.isPresent()) {
            Order existingOrder = optOrder.get();
            if (orderDto.getProductName() != null) existingOrder.setProductName(orderDto.getProductName());
            if (orderDto.getQuantity() != null) existingOrder.setQuantity(orderDto.getQuantity());
            if (orderDto.getCustomerName() != null) existingOrder.setCustomerName(orderDto.getCustomerName());
            if (orderDto.getCustomerEmail() != null) existingOrder.setCustomerEmail(orderDto.getCustomerEmail());
            if (orderDto.getCustomerPhone() != null) existingOrder.setCustomerPhone(orderDto.getCustomerPhone());
            if (orderDto.getShippingAddress() != null) existingOrder.setShippingAddress(orderDto.getShippingAddress());
            if (orderDto.getTotalAmount() != null) existingOrder.setTotalAmount(orderDto.getTotalAmount());
            if (orderDto.getStatus() != null) existingOrder.setStatus(orderDto.getStatus());
            if (orderDto.getPlatform() != null) existingOrder.setPlatform(orderDto.getPlatform());
            Order updatedOrder = orderrepo.save(existingOrder);
            return entityToDto(updatedOrder);
        }
        return null;
    }

    public OrderDTO getOrder(Long orderId) {
        Optional<Order> order = orderrepo.findById(orderId);
        return order.map(this::entityToDto).orElse(null);
    }
}
