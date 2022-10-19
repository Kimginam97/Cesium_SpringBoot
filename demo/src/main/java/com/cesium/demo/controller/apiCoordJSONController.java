package com.cesium.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

import org.springframework.ui.ModelMap;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;

@Controller
public class ApiCoordJSONController {

	@GetMapping("/sample/getCoordAddrApi.do")
	public String coordAddrFormView() {
		return "sample/apiCoordApplicationJSON";
	}

	@PostMapping("/sample/getCoordAddrApi.do")
	public void getCoordAddrApi(HttpServletRequest req, ModelMap model, HttpServletResponse response) throws Exception {
		// 요청변수 설정
		String admCd = req.getParameter("admCd");
		String rnMgtSn = req.getParameter("rnMgtSn");
		String udrtYn = req.getParameter("udrtYn");
		String buldMnnm = req.getParameter("buldMnnm");
		String buldSlno = req.getParameter("buldSlno");
		String confmKey = req.getParameter("confmKey");
		String resultType = req.getParameter("resultType"); // 요청 변수 설정 (검색결과형식 설정, json)

		// OPEN API 호출 URL 정보 설정
		String apiUrl = "https://business.juso.go.kr/addrlink/addrCoordApi.do?admCd=" + admCd + "&rnMgtSn="
				+ rnMgtSn
				+ "&udrtYn=" + udrtYn + "&buldMnnm=" + buldMnnm + "&buldSlno=" + buldSlno + "&confmKey=" + confmKey
				+ "&resultType=" + resultType;
		URL url = new URL(apiUrl);
		BufferedReader br = new BufferedReader(new InputStreamReader(url.openStream(), "UTF-8"));
		StringBuffer sb = new StringBuffer();
		String tempStr = null;

		while (true) {
			tempStr = br.readLine();
			if (tempStr == null)
				break;
			sb.append(tempStr); // 응답결과 JSON 저장
		}
		br.close();
		response.setCharacterEncoding("UTF-8");
		response.setContentType("text/xml");
		response.getWriter().write(sb.toString()); // 응답결과 반환
	}
}