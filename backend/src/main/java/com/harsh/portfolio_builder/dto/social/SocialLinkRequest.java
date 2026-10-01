package com.harsh.portfolio_builder.dto.social;
import jakarta.validation.constraints.NotBlank; import jakarta.validation.constraints.Size; import org.hibernate.validator.constraints.URL;
public record SocialLinkRequest(@NotBlank @Size(max=60) String platform,@NotBlank @URL @Size(max=500) String url){}
