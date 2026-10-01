package com.harsh.portfolio_builder.dto.github;
import java.util.List;
public record GithubRepositoryDto(String name, String description, String htmlUrl, String homepage,
                                  String language, List<String> topics, int stars, int forks) {}
