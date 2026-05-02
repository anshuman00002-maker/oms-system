	package com.example.orderservice;
	
	import java.util.ArrayList;
	import java.util.List;
	import java.util.Optional;
	
	import org.modelmapper.ModelMapper;
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
	
	    @Autowired
	    private ModelMapper modelMapper;
	    
	    public OrderDTO EntityToDto(Order order) {
			OrderDTO dto = this.modelMapper.map(order, OrderDTO.class);
			return dto;	
		}
	
	    public OrderDTO createOrder(OrderDTO dto) {
	        
	        Order order = this.modelMapper.map(dto, Order.class);
	
	       
	        Order savedOrder = orderrepo.save(order);
	
	
			OrderDTO savedDto = this.EntityToDto(savedOrder);
					
		
			return savedDto;
			
	        
	    }
	
		public List<OrderDTO> getAllOrders() {
			List<Order> orders = this.orderrepo.findAll();
			List<OrderDTO> orderDtos = new ArrayList<>();
			for(Order order1 : orders) {
				OrderDTO dto = this.EntityToDto(order1);
			 orderDtos.add(dto);
			
			}
			 return orderDtos;	
		}
	    
		
		public ApiResponse deleteOrder(Integer orderId){
			Optional<Order> order = orderrepo.findById(orderId);
			if(order.isPresent()) {
				this.orderrepo.delete(order.get());
			}
			ApiResponse response = new ApiResponse();
			response.setMessage("order deleted succesfully");
			return response;
		}
	
		public OrderDTO updateOrder(OrderDTO orderDto, Integer orderId) {
		    Optional<Order> Order = this.orderrepo.findById(orderId);
		    
		    if (Order.isPresent()) {
		        Order existingOrder = Order.get();

		        
		        modelMapper.map(orderDto, existingOrder);

		        
		        Order updatedOrder = orderrepo.save(existingOrder);

		      
		        return this.EntityToDto(updatedOrder);
		    }

		    return null; 
		}

		public OrderDTO getOrder(Integer orderId) {
		Optional<Order> order = orderrepo.findById(orderId);
		Order order1 = order.get();
		OrderDTO orders =this.EntityToDto(order1);
		return orders;
		
		}

		
	
	
	}
