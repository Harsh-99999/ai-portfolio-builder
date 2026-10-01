package com.harsh.portfolio_builder.dto.github;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
public record GithubImportRequest(@NotBlank @Pattern(regexp="[A-Za-z0-9-]{1,39}") String username,
                                  @NotBlank @Size(max=100) String repository) {}
