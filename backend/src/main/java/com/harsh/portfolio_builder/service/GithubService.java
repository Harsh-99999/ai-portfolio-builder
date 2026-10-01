package com.harsh.portfolio_builder.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.harsh.portfolio_builder.dto.github.*;
import com.harsh.portfolio_builder.dto.project.ProjectResponse;
import com.harsh.portfolio_builder.entity.Project;
import com.harsh.portfolio_builder.exception.ApiException;
import com.harsh.portfolio_builder.repository.ProjectRepository;
import com.harsh.portfolio_builder.repository.UserRepository;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

@Service
public class GithubService {
    private final RestClient client; private final String token;
    private final ProjectRepository projects; private final UserRepository users;
    public GithubService(RestClient.Builder builder, @Value("${app.github.token:}") String token,
                         ProjectRepository projects, UserRepository users) {
        this.client=builder.baseUrl("https://api.github.com").defaultHeader("Accept","application/vnd.github+json")
                .defaultHeader("X-GitHub-Api-Version","2022-11-28").defaultHeader("User-Agent","Foliocraft-Portfolio-Builder").build();
        this.token=token; this.projects=projects; this.users=users;
    }
    public List<GithubRepositoryDto> repositories(String username) {
        if(username==null || !username.matches("[A-Za-z0-9-]{1,39}")) throw new ApiException(HttpStatus.BAD_REQUEST,"INVALID_GITHUB_USERNAME","Enter a valid GitHub username");
        try {
            JsonNode body=client.get().uri(uri->uri.path("/users/{username}/repos").queryParam("per_page",100).queryParam("sort","updated").build(username))
                    .headers(h->{if(!token.isBlank())h.setBearerAuth(token);}).retrieve().body(JsonNode.class);
            List<GithubRepositoryDto> result=new ArrayList<>();
            if(body!=null && body.isArray()) for(JsonNode node:body) {
                if(node.path("fork").asBoolean()) continue;
                List<String> topics=new ArrayList<>(); node.path("topics").forEach(t->topics.add(t.asText()));
                result.add(new GithubRepositoryDto(node.path("name").asText(), text(node,"description"), text(node,"html_url"), text(node,"homepage"), text(node,"language"), topics, node.path("stargazers_count").asInt(), node.path("forks_count").asInt()));
            }
            return result;
        } catch(RestClientException exception) { throw new ApiException(HttpStatus.BAD_GATEWAY,"GITHUB_UNAVAILABLE","GitHub repositories could not be loaded right now"); }
    }
    public ProjectResponse importRepository(String email,GithubImportRequest request) {
        try {
            JsonNode repo=client.get().uri("/repos/{owner}/{repo}",request.username(),request.repository())
                    .headers(h->{if(!token.isBlank())h.setBearerAuth(token);}).retrieve().body(JsonNode.class);
            if(repo==null) throw new ApiException(HttpStatus.NOT_FOUND,"REPOSITORY_NOT_FOUND","Repository not found");
            Project p=new Project(users.findByEmailIgnoreCase(email).orElseThrow(),repo.path("name").asText());
            String description=text(repo,"description");
            p.setShortDescription(description!=null&&description.length()>300?description.substring(0,297)+"...":description);
            p.setGithubUrl(text(repo,"html_url")); p.setLiveUrl(text(repo,"homepage"));
            List<String> technologies=new ArrayList<>(); String language=text(repo,"language"); if(language!=null)technologies.add(language);
            repo.path("topics").forEach(t->technologies.add(t.asText())); p.setTechnologies(technologies);
            p.setDisplayOrder(projects.findAllByUserEmailIgnoreCaseOrderByDisplayOrderAscNameAsc(email).size());
            Project saved=projects.save(p);
            return new ProjectResponse(saved.getId(),saved.getName(),saved.getShortDescription(),saved.getDescription(),saved.getImageUrl(),saved.getGithubUrl(),saved.getLiveUrl(),List.copyOf(technologies),saved.getDisplayOrder());
        } catch(org.springframework.web.client.HttpClientErrorException.NotFound exception) {
            throw new ApiException(HttpStatus.NOT_FOUND,"REPOSITORY_NOT_FOUND","Public repository not found");
        } catch(RestClientException exception) { throw new ApiException(HttpStatus.BAD_GATEWAY,"GITHUB_UNAVAILABLE","GitHub repository could not be imported right now"); }
    }
    private String text(JsonNode node,String key) { JsonNode value=node.get(key); return value==null||value.isNull()||value.asText().isBlank()?null:value.asText(); }
}
