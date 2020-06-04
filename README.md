# PHPOnl

Table of Contents

* [**Prepare Github page**](#prepare-gh-page)
* [**Determine subdomain**](#determine-subdomain)
* [**Create CNAME file**](#create-cname)
* [**Submit pull request**](#submit-pr)
* [**Enforce HTTPS**](#enforce-https)

<a name="prepare-gh-page"></a>
## # Prepare Github page

First of all, PHP.Onl only provides free subdomain. We have no hosting service so you have to do it your self.

Github is the largest development platform and it offers amazing static site hosted service. You are allowed to create and publish free site through Github pages service

By pointing PHP.Onl subdomain to your Github pages, you get a perfect combination that may fit your need on promoting Personal portfolio, OSS Project, or Organization profile...

Create Github pages is quite easy. We expected that you have a page before integrate to PHP.Onl.
In case you don't know what is Github pages, please check out it here or follow this instruction to create one.

<a name="determine-subdomain"></a>
## # Determine subdomain

PHP.Onl subdomain can be used for a personal page or project page, nothing is limited here. The choice of the subdomain is depended on you. Although you are free to choose whatever subdomain you want, it's better if you choose a subdomain that best matches your type of page.

If you are creating a subdomain for your portfolio page, the subdomain should match your name or something that describe you.

As a page for the project, the subdomain should be the project name. In some cases that you can not get the suitable subdomain name for github.io, there is still a chance that the domain name is still available at PHP.Onl, and you are free to use it.

**Some example that may help you determine your subdomain:**

+ **Personal portfolio**: Assumed that your personal page is `JamesCharles1990.github.io`, so you can consider choosing the name `JamesCharles.php.onl` for better identification (of course, you can only use this domain if it is not used by other)

+ **Project page**: It's easier for the project's authors to choose the subdomain as they already named their projects. The tip is quite simple: The subdomain is equal to the project name!
For example, you are writing and maintaining a PHP project called `FastRouter`, so `fastrouter.php.onl` may be the thing you are looking for.

<a name="create-cname"></a>
## # Create CNAME file

From the Github side

> You can set up or update certain DNS records and your repository settings to point the default domain for your GitHub Pages site to a custom domain.

Add a file named "CNAME" to your repo (in the "gh-pages" branch for project pages) with a single line matching the domain you have chosen (e.g. "fastrouter.php.onl" without quotes). If you face any problems, check out the section about [Custom URLs](https://help.github.com/articles/setting-up-a-custom-domain-with-github-pages/#creating-and-committing-a-cname-file) at GitHub Pages Help.

<a name="submit-pr"></a>
## # Submit pull request

The last step, but the most important

You have to submit a pull request to [php.onl repo](https://github.com/phponl/php.onl) that adds your subdomain to the list of existing php.onl domains. Your new URL should go live within 24 hours (keep an eye on your pull request in case of a naming conflict or a question from our side).

Make sure to submit your pull request with this form of message:

```
- Subdomain: Full_Subdomain
- Target: Domain_Target
- Use Cloudflare Proxy: Yes
- I agree with TOS: Yes
```

:warning: **Attention**: Before creating a pull request. Please assign a label named "register domain" to perform domain check progress. If not, please close the pull request and create again include "register domain" label when creating a pull request.

PR example: https://github.com/phponl/php.onl/pull/13

<a name="enforce-https"></a>
## # Enforce HTTPS

By default, your site can be accessed with both `http://` and `https://` protocols. It's not recommended to use `http://` protocol and you can force your users to use https by setting as described [here](https://help.github.com/en/github/working-with-github-pages/securing-your-github-pages-site-with-https).
