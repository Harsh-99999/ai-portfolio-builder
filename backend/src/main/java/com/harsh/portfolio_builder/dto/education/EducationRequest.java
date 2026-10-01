package com.harsh.portfolio_builder.dto.education;
import jakarta.validation.constraints.NotBlank; import jakarta.validation.constraints.Pattern; import jakarta.validation.constraints.Size;
public record EducationRequest(@NotBlank @Size(max=180) String institution,@NotBlank @Size(max=120) String degree,
 @Size(max=120) String fieldOfStudy,@Pattern(regexp="^\\d{4}-\\d{2}$") String startDate,@Pattern(regexp="^\\d{4}-\\d{2}$") String endDate,@Size(max=2000) String description){}
