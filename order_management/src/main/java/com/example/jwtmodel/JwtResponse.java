package com.example.jwtmodel;

public class JwtResponse {
    private String jwtToken;
    private String userName;

    public String getJwtToken() { return jwtToken; }
    public void setJwtToken(String jwtToken) { this.jwtToken = jwtToken; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
}
