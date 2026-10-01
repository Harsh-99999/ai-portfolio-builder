package com.harsh.portfolio_builder.dto.social;
import com.harsh.portfolio_builder.entity.SocialLink;
public record SocialLinkResponse(Long id,String platform,String url){public static SocialLinkResponse from(SocialLink s){return new SocialLinkResponse(s.getId(),s.getPlatform(),s.getUrl());}}
