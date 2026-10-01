package com.harsh.portfolio_builder.dto.profile;
import com.harsh.portfolio_builder.entity.Profile;
public record PublicProfileResponse(String fullName,String headline,String bio,String profileImageUrl,String location,String phone){
 public static PublicProfileResponse from(Profile p){return new PublicProfileResponse(p.getFullName(),p.getHeadline(),p.getBio(),p.getProfileImageUrl(),p.getLocation(),p.getPhone());}
}
